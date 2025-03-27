export async function getShop() {
try {
  const res = await fetch("/api/shop", { method: "GET", cache: "no-store" });
  const response = await res.json();
  if (response) {
    return response
  }
} catch (error) {
  console.log(error)
}
}
