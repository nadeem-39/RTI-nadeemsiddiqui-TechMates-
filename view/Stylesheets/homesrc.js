/*gsap.to("#circle", {
    rotate: 0,
    ease: Expo.easeInOut,
    duration: 1
});*/


const texts = ["Information", "Education", "Development", "Right", "Legal", "Demo 6"];
const circle = document.querySelector("#circle");
const angleIncrement = 20; // Degrees between each text item

// Calculate positions based on current layout
const positions = [];
for (let i = 0; i < texts.length; i++) {
  positions.push(30 - (i * angleIncrement));
}

function animateSearch() {
  let tl = gsap.timeline({ repeat: -1 });
  const stripes = document.querySelectorAll(".stripe");
  
  texts.forEach((_, index) => {
    // 1. Initial "searching" wiggle (small back-and-forth movements)
    tl.to(circle, {
      rotate: `+=${15 + Math.random() * 10}`,
      duration: 0.3,
      ease: "sine.inOut"
    });
    tl.to(circle, {
      rotate: `-=${10 + Math.random() * 5}`,
      duration: 0.2,
      ease: "sine.inOut"
    });
    
    // 2. Move to target position with overshoot
    tl.to(circle, {
      rotate: positions[index],
      duration: 0.8,
      ease: "back.out(1.2)",
      onStart: () => {
        // Highlight the target stripe
        stripes.forEach(s => s.classList.remove("active"));
        stripes[index].classList.add("active");
      }
    });
    
    // 3. Pause briefly on selection
    tl.to({}, { duration: 1 });
  });
}

animateSearch();