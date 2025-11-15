(() => {
    const output = document.getElementById('output');
    const form = document.getElementById('form');
    const input = document.getElementById('cmd');
    const terminal = document.getElementById('terminal');

    const PROFILE = {
        name: "Maverick",
        title : " Hack Club Leader",
        bio: [
            "Hi, I'm Maverick! I'm a high school student passionate about coding and technology.",
            "I love building web applications and exploring new programming languages.",
            "In my free time, I enjoy hiking, reading sci-fi novels, and playing chess.",
            "This terminal is my online calling card. Try 'projects' to see shipped sites."
        ],
        projects: [
            { name: "Club Website", url: "https://jash-bhc.framer.website" },
            { name: "Maverick Terminal (this site)", url: "#" },
            { name: "Weather App", url: "https://github.com/Maverick-500/VirtualPainter" }
        ],
        contact: [
            "Email: ahujajash@gmail.com",
            "GitHub: https://github.com/Maverick-500",
            "Discord: maverick.rider500"
        ]
    };

    function el(text, className){
        const node = document.createElement('div');
        if(className) node.className = className;
        node.textContent = text;
        return node;
    }

    function typeLine(text, opts = {}){
        const speed = typeof opts.speed === 'number' ? opts.speed : 18;
        const container = document.createElement('div');
        container.className = opts.className || '';
        output.appendChild(container);
        terminal.scrollTop = terminal.scrollHeight;

        return new Promise(resolve => {
            let i=0;
            function step(){
                if(i < text.length){
                    container.textContent += text.charAt(i);
                    i++;
                    terminal.scrollTop = terminal.scrollHeight;
                    setTimeout(step, speed);
                } else {
                    container.innerHTML = container.textContent;
                    resolve();
                }
            }
            step();
        });
    }

    async function printLines(lines, opts={}){
        for(const line of lines){
            if(typeof line==='string') await typeLine(line, opts);
            else if(line instanceof HTMLElement) output.appendChild(line);
        }
        terminal.scrollTop = terminal.scrollHeight;
    }

    function printNow(text,className){
        const node=el(text,className);
        output.appendChild(node);
        terminal.scrollTop = terminal.scrollHeight;
    }

    function clearScreen(){
        output.innerHTML='';
        terminal.scrollTop = terminal.scrollHeight;
    }

    let matrixActive=false;
    function toggleMatrixMode(on){
        matrixActive=typeof on==='boolean'?on:!matrixActive;
        if(matrixActive){
            terminal.classList.add('matrix');
            printNow("Matrix mode activated.","info");
        } else {
            terminal.classList.remove('matrix');
            printNow("Matrix mode deactivated.","info");
        }
    }

    async function handleCommand(raw){
        const line=raw.trim();
        if(!line) return;

        printNow(`maverick@terminal:~$ ${line}`,'cmd-echo');

        const [cmd,...args]=line.split(/\s+/);
        const rest=args.join(' ');

        switch(cmd.toLowerCase()){
            case 'help':
                await printLines([
                    "Available commands:",
                    "  help      - show this help",
                    "  about     - who I am",
                    "  projects  - list projects and links",
                    "  contact   - how to reach me",
                    "  clear     - clear the terminal",
                    "  echo ...  - repeat text",
                    "  maverick  - show the Shadow logo",
                    "  matrix    - toggle matrix mode"
                ]);
                break;
            case 'about':
                await printLines([`Name: ${PROFILE.name}`, `Title: ${PROFILE.title}`, '', ...PROFILE.bio]);
                break;
            case 'projects':
                if(PROFILE.projects.length===0){
                    await printLines(["No projects to show."]);
                } else {
                    const lines=["Projects:"];
                    PROFILE.projects.forEach(p=>{
                        lines.push(` - ${p.name} — ${p.url}`);
                    });
                    await printLines(lines);
                }
                break;
            case 'contact':
                await printLines(["Contact: ",...PROFILE.contact]);
                break;
            case 'clear':
                clearScreen();
                break;
            case 'echo':
                await printLines([rest]);
                break;
            case 'maverick':
                const asciiGlitch=`
  __  __                      _      _    
 |  \\/  |                    (_)    | |   
 | \\  / | __ ___   _____ _ __ _  ___| | __
 | |\\/| |/ _\` \\ \\ / / _ \\ '__| |/ __| |/ /
 | |  | | (_| |\\ V /  __/ |  | | (__|   < 
 |_|  |_|\\__,_| \\_/ \\___|_|  |_|\\___|_|\\_\\
                                          
`;
                await printLines([asciiGlitch,'"Even god can\'t save you now"'],{className:'glitch'});
                break;
            case 'matrix':
                toggleMatrixMode();
                break;
            default:
                await printLines([`Command not found: ${cmd}`,`Type 'help' for a list of commands.`]);
        }
    }

    async function bootSequence(){
        await typeLine("Initiating Maverick Terminal v1.0...");
        await typeLine("Loading modules: [terminal] [profile] [projects]");
        await typeLine("");
        await printLines(["Welcome — type 'help' to get started."]);
        terminal.scrollTop = terminal.scrollHeight;
    }

    form.addEventListener('submit', async e=>{
        e.preventDefault();
        const value=input.value;
        input.value='';
        input.blur();
        await handleCommand(value);
        input.focus();
    });

    document.addEventListener('keydown', e=>{
        if((e.ctrlKey || e.metaKey) && e.key.toLowerCase()==='l'){
            e.preventDefault();
            clearScreen();
        }
    });

    bootSequence();
})();
