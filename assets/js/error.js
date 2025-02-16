export default function error(msg) {
  const errorElement = document.getElementById("error_msg");
  errorElement.innerHTML = msg;

  errorElement.classList.add("visible");

  setTimeout(() => {
    errorElement.classList.remove("visible");
  }, 3000);
}
