import { client, account, databases, ID, Query, storage, submit, recordAnswer, query, results } from '../appWrite';

document.addEventListener("DOMContentLoaded", () => {
    const tiles = document.querySelectorAll(".tiles > div"); 
    const fullScreen = document.getElementById("fullScreen");
    const questionNum = document.getElementById("questionNum"); 
    const questionText = document.getElementById("questionText"); 
    const btnClose = document.getElementById("x"); 
    const btnSubAns = document.getElementById("submitAnswer"); 
    const tileAnswer = document.getElementById("answer"); 
    const fraction = document.getElementById("fraction")
    const fraction2 = document.getElementById("fraction2")
    const top = document.getElementById("top");
    const bottom = document.getElementById("bottom");
    const btnSquare = document.getElementById("btnSquare")
    const btnPower = document.getElementById("btnPower")
    const top2 = document.getElementById("top2");
    const bottom2 = document.getElementById("bottom2");
    const btnPi = document.getElementById("btnPi");
    const tileAnswer2 = document.getElementById("answer2"); 
    const btnSquare2 = document.getElementById("btnSquare2");
    const btnRoot = document.getElementById("btnRoot");
    let everyQuestion = [];
    let answers = [];
    let mathsScore = 0;
    let userAnswers = [];
    let counter = 0;

    btnSquare.addEventListener("click", () => {
        let cursorPosition = tileAnswer.selectionStart;
        let value = tileAnswer.value;
        const newValue = value.slice(0, cursorPosition) + "√" + value.slice(cursorPosition);
        tileAnswer.value = newValue;
        tileAnswer.selectionStart = tileAnswer.selectionEnd = cursorPosition + 1;
        tileAnswer.focus();
    })

    btnPower.addEventListener("click", () => {
        let cursorPosition = tileAnswer.selectionStart;
        let value = tileAnswer.value;
        const newValue = value.slice(0, cursorPosition) + "²" + value.slice(cursorPosition);
        tileAnswer.value = newValue;
        tileAnswer.selectionStart = tileAnswer.selectionEnd = cursorPosition + 1;
        tileAnswer.focus();
    })

    btnPi.addEventListener("click", () => {
        let cursorPosition = tileAnswer2.selectionStart;
        let value = tileAnswer2.value;
        const newValue = value.slice(0, cursorPosition) + "π" + value.slice(cursorPosition);
        tileAnswer2.value = newValue;
        tileAnswer2.selectionStart = tileAnswer2.selectionEnd = cursorPosition + 1;
        tileAnswer2.focus();
    })

    btnSquare2.addEventListener("click", () => {
        let cursorPosition = tileAnswer.selectionStart;
        let value = tileAnswer.value;
        const newValue = value.slice(0, cursorPosition) + "√" + value.slice(cursorPosition);
        tileAnswer.value = newValue;
        tileAnswer.selectionStart = tileAnswer.selectionEnd = cursorPosition + 1;
        tileAnswer.focus();
    })

    btnRoot.addEventListener("click", () => {
        let cursorPosition = tileAnswer.selectionStart;
        let value = tileAnswer.value;
        const newValue = value.slice(0, cursorPosition) + "√" + value.slice(cursorPosition);
        tileAnswer.value = newValue;
        tileAnswer.selectionStart = tileAnswer.selectionEnd = cursorPosition + 1;
        tileAnswer.focus();
    })

    submit().then(questions => {
        console.log(questions);
        everyQuestion = questions;

        for(let i = 0; i < 10 ; i++){
            answers.push(everyQuestion[i].answer);
        }
        
        tiles.forEach(tile => {
            tile.addEventListener("click", () => {
                const questionNumber = tile.getAttribute("data-question");
                const index = parseInt(questionNumber, 10) - 1;
                btnSubAns.style.display = 'block';
                questionNum.textContent = `Question ${questionNumber}`; 
                questionText.innerHTML = everyQuestion[index].question; 
                fraction.style.display = "none";
                btnClose.style.position = "absolute";
                btnClose.style.left = "650px";
                btnClose.style.top = "506px";
                btnClose.style.width = "40%";
                fullScreen.style.display = "flex"; 
                btnSquare.style.display = "none";
                btnPower.style.display = "none";
                btnPi.style.display = "none";
                fraction2.style.display = "none";
                tileAnswer2.style.display = "none";
                btnSquare2.style.display = "none";
                btnRoot.style.display = "none";
                tileAnswer.style.display = "block";
                tileAnswer.value = "";

                const questionId = tile.getAttribute("data-question");

                const data = everyQuestion.find(q => q.$id === questionNumber);

                if(data){
                    questionNum.textContent = `Question ${questionId}`;
                    questionText.innerHTML = data.question;
                    fullScreen.style.display = "flex";
                }

                if(["2"].includes(questionNumber)){
                    tileAnswer.style.display = "none";
                    fraction.style.display = "block";
                }
                else if(["3"].includes(questionNumber)){
                    btnRoot.style.display = "block";
                }
                else if(["4"].includes(questionNumber)){
                    btnPower.style.display = "block";
                }
                else if(["5"].includes(questionNumber)){
                    fraction2.style.display = "block";
                    btnPi.style.display = "block";
                    tileAnswer.style.display = "none";
                    tileAnswer2.style.display = "block";
                }
                else if(["8"].includes(questionNumber)){
                    btnSquare2.style.display = "block";
                }
                
            });
        });

        
    })


    btnClose.addEventListener("click", () => {
        fullScreen.style.display = "none";
    });

    btnSubAns.addEventListener("click", async() => {
        const questionNumber = questionNum.textContent.split(' ')[1];
        let userAnswer = "";
        let userRadioAnswer; 
        let userFracAnswer = top.value.trim() + bottom.value.trim();
        let userFracAnswer2 = top2.value.trim() + bottom2.value.trim() + tileAnswer2.value.trim();
        counter++;

        if(questionNumber === "2"){
            userAnswer = userFracAnswer;
        }
        else if(questionNumber === "5"){
            userAnswer = userFracAnswer2;
        }
        else{
            userAnswer = tileAnswer.value.trim();
        }

        if(userAnswer){

            let theAnswer = userAnswer;
            let correctAns = answers[questionNumber - 1];
            const correct = theAnswer === correctAns;
            userAnswers[questionNumber] = userAnswer;
            const tile = document.querySelector(`.tiles > div[data-question="${questionNumber}"]`);
            let questionId = everyQuestion[questionNumber - 1].$id;

            const userId = await query();
            console.log(userId);
            await recordAnswer(userId, questionId, theAnswer, correct);

            if(correct){
                mathsScore++;
            }

            tile.style.pointerEvents = 'none';

            btnSubAns.style.display = 'none';
            btnClose.style.width = "1000px";
            btnClose.style.left = "90px";
            
        }
        else{
            alert("Please enter answer");
        }

        if(counter === 10){
            const userId = await query();
            results(userId, mathsScore);
            window.location.href="hub.html";
            alert("Welcome to 1+1! Using the edit button next to the logout button, feel free to edit any of your user details, add your phone number or even add a profile picture to personalise your account further!")
        }
    });
});
