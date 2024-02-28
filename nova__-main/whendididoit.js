const now = new Date();
const date = now.toLocaleDateString("en-US", {
	month: "2-digit",
	day: "2-digit",
	year: "numeric",
});
const time = now.toLocaleTimeString("en-US", { hour12: false });
console.log(`${date} ${time}`);
