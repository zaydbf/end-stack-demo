
// ---------------- Endianness Logic ----------------
const bytes = ["00", "11", "22", "33", "44", "55", "66", "77"];
let index = 0;
let little = Array(8).fill("--");
let big = Array(8).fill("--");

const littleRow = document.getElementById("little-row");
const bigRow = document.getElementById("big-row");

const renderEndian = () => {
    littleRow.innerHTML = "<td>Little Endian</td>" +
    little.map(b => `<td>${b}</td>`).join("");

    bigRow.innerHTML = "<td>Big Endian</td>" +
    big.map(b => `<td>${b}</td>`).join("");
};

renderEndian();

document.getElementById("loadAddress").addEventListener("click", () => {
    if (index >= bytes.length) return;
    little[index] = bytes[index];
    big[7 - index] = bytes[index];
    index++;
    renderEndian();
});

document.getElementById("resetEndian").addEventListener("click", () => {
    index = 0;
    little = Array(8).fill("--");
    big = Array(8).fill("--");
    renderEndian();
});

// ---------------- Stack Logic ----------------
let stack = ["0xabcdef", "0x1234567890"];
const stackTable = document.getElementById("stackTable");
const raxInput = document.getElementById("rax");

function renderStack() {
    const visibleStack = Array(5 - stack.length).fill("--").concat(stack);
    stackTable.innerHTML = visibleStack.map((addr, i) => {
    const isRsp = i === 5 - stack.length;
    const isRbp = i === 4;
    const note = isRsp && addr !== "--" ? "&lt;-- Top of Stack ($rsp)" :
                    isRbp ? "&lt;-- Bottom of Stack ($rbp)" : "";
    return `
        <tr>
        <td class="stack-cell">${addr}</td>
        <td class="stack-cell" style="text-align:left;">${note}</td>
        </tr>`;
    }).join("");
}

renderStack();

document.getElementById("push").addEventListener("click", () => {
    const val = raxInput.value.trim();
    if (val && stack.length < 5) {
    stack.unshift(val);
    raxInput.value = "";
    renderStack();
    }
});

document.getElementById("pop").addEventListener("click", () => {
    if (stack.length > 0) {
    const popped = stack.shift();
    raxInput.value = popped;
    renderStack();
    }
});

document.getElementById("resetStack").addEventListener("click", () => {
    stack = ["0xabcdef", "0x1234567890"];
    raxInput.value = "";
    renderStack();
});

// ---------------- Stack Buffer Overflow Logic ----------------


let overflowStack = ["0x401000", "0x12345678"]; 
const overflowTable = document.getElementById("overflowTable");
const overflowInput = document.getElementById("overflowInput");

function renderOverflow() {
    const visibleStack = Array(5 - overflowStack.length).fill("--").concat(overflowStack);
    
    overflowTable.innerHTML = visibleStack.map((addr, i) => {
      
        const stackIndex = i - (5 - overflowStack.length);
        const isRsp = stackIndex === 0;
        const isRet = (overflowStack.length >= 2 && stackIndex === overflowStack.length - 2); 
        const isRbp = (stackIndex === overflowStack.length - 1);

        let note = "";
        let style = "";

        if (isRsp && addr !== "--") note = "&lt;-- Top of Stack ($rsp)";
        else if (isRet) {
             note = "&lt;-- Return Address ($rip)";
             if (addr !== "0x401000") {
                 style = "color: red; font-weight: bold;";
                 note = "&lt; ($rip overwritten)";
             }
        }
        else if (isRbp) note = "&lt;-- Bottom of Stack ($rbp)";

        return `
            <tr>
                <td class="stack-cell" style="${style}">${addr}</td>
                <td class="stack-cell" style="text-align:left; ${style}">${note}</td>
            </tr>`;
    }).join("");
}

renderOverflow();

document.getElementById("overflowPush").addEventListener("click", () => {
    const val = overflowInput.value;
    if (val && overflowStack.length < 5) {
        
        const chunks = val.match(/.{1,8}/g) || [];
        

        const firstChunk = chunks.shift();
        overflowStack.unshift(firstChunk); 

        chunks.forEach((chunk, i) => {
            if (i + 1 < overflowStack.length) {
                overflowStack[i + 1] = chunk;
            }
        });

        overflowInput.value = "";
        renderOverflow();
    }
});

document.getElementById("overflowPop").addEventListener("click", () => {
    if (overflowStack.length > 0) {
        const popped = overflowStack.shift();
        overflowInput.value = popped;
        renderOverflow();
    }
});

document.getElementById("overflowReset").addEventListener("click", () => {
    overflowStack = ["0x401000", "0x12345678"];
    overflowInput.value = "";
    renderOverflow();
});