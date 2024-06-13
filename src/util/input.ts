let rightPressed = false;
let leftPressed = false;

document.addEventListener("keydown", (event: KeyboardEvent) => {
    switch  ( event.key ){
        case ("ArrowRight"): {
            rightPressed = true;
            break;
        }
        case ("ArrowLeft"): {
            leftPressed = true;
            break;
        }
    }
});

document.addEventListener("keyup", () => {
    rightPressed = false;
    leftPressed = false;
});

export { rightPressed, leftPressed };
