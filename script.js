
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
