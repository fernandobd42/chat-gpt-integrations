const OPENAPI_KEY = 'your chat gpt api key';

const submitButton = document.querySelector('#submit')
const outputElement = document.querySelector('#output')
const inputElement = document.querySelector('.input-container input')
const historyElement = document.querySelector('#history')
const newChatBtnElement = document.querySelector('#new-chat')
let isFetching = false;

const changeInput = (value) => {
    inputElement.value = value
}

const appendInputToHistory = () => {
    const pElement = document.createElement('p');
    pElement.textContent = inputElement.value;
    pElement.addEventListener('click', () => changeInput(pElement.textContent))
    historyElement.append(pElement);
    inputElement.value = ''
}

const handleFetching = (fetch) => {
    isFetching = fetch
    if (isFetching) {
        submitButton.textContent = '...fetching'
        submitButton.classList.add('disabled')
    } else {
        submitButton.textContent = '➢'
        submitButton.classList.remove('disabled')
    }
}

const getMessage = async () => {
    if (isFetching) return;

    const options = {
        method: 'POST',
        headers: {
            Authorization: `Bearer ${OPENAPI_KEY}`,
            "Content-Type": 'application/json'
        },
        body: JSON.stringify({
            model: 'gpt-3.5-turbo',
            messages: [
                { 
                    role: 'user',
                    content: inputElement.value
                }
            ]
        })
    }

    try {
        handleFetching(true)
        const response = await fetch('https://api.openai.com/v1/chat/completions',  options)
        const data = await response.json();
        outputElement.textContent = data.choices[0].message.content;
        handleFetching(false)
        appendInputToHistory()
        
    } catch (error) {
        handleFetching(false)
        console.error({ error })
    }
}

submitButton.addEventListener('click', getMessage)

const clearInput = () => {
    inputElement.value = '';
}
newChatBtnElement.addEventListener('click', clearInput)
