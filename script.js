

function scrollToSection(sectionId) {

document.getElementById(sectionId).scrollIntoView({
behavior: "smooth"
});

}



const cursor = document.querySelector(".cursor");
const follower = document.querySelector(".cursor-follower");

let mouseX = 0;
let mouseY = 0;

let followerX = 0;
let followerY = 0;

document.addEventListener("mousemove", (e) => {

mouseX = e.clientX;
mouseY = e.clientY;

cursor.style.left = mouseX + "px";
cursor.style.top = mouseY + "px";

});

function animateCursor(){

followerX += (mouseX - followerX) * 0.1;
followerY += (mouseY - followerY) * 0.1;

follower.style.left = followerX + "px";
follower.style.top = followerY + "px";

requestAnimationFrame(animateCursor);

}

animateCursor();

const links = document.querySelectorAll("a, button");

links.forEach(link => {

link.addEventListener("mouseenter", () => {
follower.style.transform = "translate(-50%, -50%) scale(1.8)";
});

link.addEventListener("mouseleave", () => {
follower.style.transform = "translate(-50%, -50%) scale(1)";
});

});

const toggleBtn = document.getElementById("theme-toggle");

toggleBtn.addEventListener("click", () => {

document.body.classList.toggle("light-mode");

if(document.body.classList.contains("light-mode")){
toggleBtn.textContent = "☀️";
}else{
toggleBtn.textContent = "🌙";
}

});

const menuToggle = document.getElementById("menu-toggle");
const navLinks = document.getElementById("nav-links");

menuToggle.addEventListener("click", () => {

navLinks.classList.toggle("active");

});

const linkss = document.querySelectorAll(".nav-links a");

links.forEach(link => {

link.addEventListener("click", () => {
navLinks.classList.remove("active");
});

});