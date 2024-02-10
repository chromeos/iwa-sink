document.getElementById('borderless').addEventListener('click', async (e) => {
  e.preventDefault();
  const screenDetails = await window.getScreenDetails();
  console.log(screenDetails);
});