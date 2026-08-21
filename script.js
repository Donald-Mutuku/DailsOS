const screen = document.querySelector('.screen');
const virtualCursor = document.getElementById('virtualCursor')

screen.addEventListener('mousemove', (e) => {
    const rect = screen.getBoundingClientRect();

    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;

    virtualCursor.style.left = `${x}px`;
    virtualCursor.style.top = `${y}px`;
});

screen.addEventListener('mouseenter', () =>{
    virtualCursor.style.display = 'block';
});

screen.addEventListener('mouseleave', () => {
    virtualCursor.style.display = 'none';
});

let isDragging = false;

screen.addEventListener('mousemove', (e) => {
    if (isDragging) return;

    const rect = screen.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;

    virtualCursor.style.left = `${x}px`;
    virtualCursor.style.top = `${y}px`;
});


dragElement(document.getElementById("window"));

function dragElement(element) {
    var initialX = 0;
    var initialY = 0;
    var currentX = 0;
    var currentY = 0;
    let grabOffsetX = 0;
    let grabOffsetY = 0;

    // immediately the page loads, the window gets forced inside boundaroes
    clampPosition(element.offsetTop, element.offsetLeft);

    function clampPosition(targetTop, targetLeft) {
        const parent = element.parentElement;
        if (!parent) return;

        const minTop = 0;
        const minLeft = 0;
        const maxTop = parent.clientHeight - element.offsetHeight;
        const maxLeft = parent.clientWidth - element.offsetWidth;

        const clampedTop = Math.max(minTop, Math.min(targetTop, maxTop));
        const clampedLeft = Math.max(minLeft, Math.min(targetLeft, maxLeft));

        element.style.top = `${clampedTop}px`;
        element.style.left = `${clampedLeft}px`;

        // if the window is being dragged, we glue the cursor to its grab position
        if (isDragging) {
            virtualCursor.style.left = `${clampedLeft + grabOffsetX}px`;
            virtualCursor.style.top = `${clampedTop + grabOffsetY}px`;
        }
    }

    if (document.getElementById(element.id + "header")) {
        document.getElementById(element.id + "header").onmousedown = startDragging;
    }
    else {
        element.onmousedown = startDragging;
    }

    function startDragging(e) {
        e = e || window.event;
        e.preventDefault();

        isDragging = true;

        // this gets the position where the user clicked inside the window, relative to the top-left of the window
        const winRect = element.getBoundingClientRect();
        grabOffsetX = e.clientX - winRect.left;
        grabOffsetY = e.clientY - winRect.top;

        initialX = e.clientX;
        initialY = e.clientY;

        document.onmouseup = stopDragging;
        document.onmousemove = stepDrag;
    }

    function stepDrag(e) {
        e = e || window.event;
        e.preventDefault();

        currentX = initialX - e.clientX;
        currentY = initialY - e.clientY;
        initialX = e.clientX;
        initialY = e.clientY;

        const nextTop = element.offsetTop - currentY;
        const nextLeft = element.offsetLeft - currentX;

        // Apply clamped coordinates on every mouse move
        clampPosition(nextTop, nextLeft);
    }

    function stopDragging () {
        // turns off this flag so that the cursor is free to move again
        isDragging = false;
        document.onmouseup = null;
        document.onmousemove = null;
    }

    window.addEventListener('resize', () => {
        clampPosition(element.offsetTop, element.offsetLeft);
    });
}
