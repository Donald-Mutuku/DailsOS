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
