// Sample Story Data 
const stories = {
    "mystery": {
        start: "The detective arrives at the crime scene. What should he do?",
        choices: [
            {
                text: "Examine the body but don't touch ",
                next: {
                    text: "The body reveals a strange mark on the hand. What next?",
                    choices: [
                        { 
                            text: "Inspect the mark but don't move the body", 
                            next: "The mark appears to be a tattoo of a snake, symbolizing the local gang in London." 
                        },
                        { 
                            text: "Look for clues around the room", 
                            next: "You find a blood-stained letter under the table." 
                        }
                    ]
                }
            },
            {
                text: "Talk to the witnesses",
                next: {
                    text: "The witnesses seem hesitant to speak. What should the detective do?",
                    choices: [
                        { 
                            text: "Intimidate them", 
                            next: "They reveal that they saw a suspicious man leaving the scene but couldn't do nothing." 
                        },
                        { 
                            text: "Calmly ask questions", 
                            next: "One witness nervously mentions seeing a black car driving away quickly." 
                        }
                    ]
                }
            }
        ]
    },
    "heist": {
        start: "The heist is about to begin. The detective is on a stakeout. What should he do?",
        choices: [
            {
                text: "Monitor the main entrance",
                next: {
                    text: "A suspicious figure appears at the main entrance. What next?",
                    choices: [
                        { 
                            text: "Follow the figure", 
                            next: "The figure leads the detective to a hidden door behind the building." 
                        },
                        { 
                            text: "Wait and observe", 
                            next: "The figure meets someone and exchanges a briefcase." 
                        }
                    ]
                }
            },
            {
                text: "Check the back alley",
                next: {
                    text: "The alley seems quiet, but something feels off. What should the detective do?",
                    choices: [
                        { 
                            text: "Search the alley", 
                            next: "A hidden stash of money is found behind a dumpster." 
                        },
                        { 
                            text: "Set up a camera", 
                            next: "The detective captures footage of a secret exchange." 
                        }
                    ]
                }
            }
        ]
    }
};

// DOM Elements
const storyBox = document.getElementById("story-text");
const choicesContainer = document.getElementById("choices-container");
const loadStoryButton = document.getElementById("load-story");
const restartButton = document.getElementById("restart");

// Load Story based on Keyword
loadStoryButton.addEventListener("click", () => {
    const keyword = document.getElementById("story-keyword").value.toLowerCase();
    if (stories[keyword]) {
        loadStory(stories[keyword]);
    } else {
        storyBox.textContent = "Sorry, no story found with that keyword. Please try another.";
        choicesContainer.innerHTML = '';
        restartButton.style.display = "none";
    }
});

// Function to load a story
function loadStory(storyData) {
    storyBox.textContent = storyData.start;
    choicesContainer.innerHTML = '';
    restartButton.style.display = "none";
    
    // Create choice buttons
    storyData.choices.forEach(choice => {
        const button = createChoiceButton(choice.text, choice.next);
        choicesContainer.appendChild(button);
    });
}

// Create choice buttons
function createChoiceButton(choiceText, nextData) {
    const button = document.createElement("button");
    button.className = "choice-button";
    button.textContent = choiceText;
    button.addEventListener("click", () => {
        handleNextStep(nextData);
    });
    return button;
}

// Handle next step in the story
function handleNextStep(nextData) {
    if (typeof nextData === "string") {
        // Display end message
        storyBox.textContent = nextData;
        choicesContainer.innerHTML = '';
        restartButton.style.display = "block";
    } else if (nextData.text && nextData.choices) {
        // Load next part of the story with choices
        storyBox.textContent = nextData.text;
        choicesContainer.innerHTML = '';
        nextData.choices.forEach(choice => {
            const button = createChoiceButton(choice.text, choice.next);
            choicesContainer.appendChild(button);
        });
    }
}

// Restart Story
restartButton.addEventListener("click", () => {
    document.getElementById("story-keyword").value = '';
    storyBox.textContent = "Welcome! Please enter a keyword to start a story.";
    choicesContainer.innerHTML = '';
    restartButton.style.display = "none";
});
