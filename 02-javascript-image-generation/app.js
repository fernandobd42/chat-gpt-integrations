const OPENAPI_KEY = 'your chat gpt api key'

const submitButton = document.querySelector('#submit')
const imagesSectionElement = document.querySelector('.images-section')
const inputElement = document.querySelector('.input-container input')
let isFetching = false

const handleFetching = (fetching) => {
  isFetching = fetching
  if (isFetching) {
      submitButton.textContent = '...fetching'
      submitButton.classList.add('disabled')
  } else {
      submitButton.textContent = '➢'
      submitButton.classList.remove('disabled')
  }
}

const getImages = async () => {
  if (isFetching) return

    const options = {
        method: 'POST',
        headers: {
            Authorization: `Bearer ${OPENAPI_KEY}`,
            "Content-Type": 'application/json'
        },
        body: JSON.stringify({
          prompt: inputElement.value,
          n: 4,
          size: "1024x1024"
        })
    }

    try {
        handleFetching(true)
        const response = await fetch('https://api.openai.com/v1/images/generations',  options)
        const data = await response.json()
        data?.data?.forEach(image => {
          const imageContainer = document.createElement('div')
          imageContainer.classList.add('image-container')
          const imageElement = document.createElement('img')
          imageElement.setAttribute('src', image.url)
          imageContainer.append(imageElement)
          imagesSectionElement.append(imageContainer)
        })
        handleFetching(false)
        
    } catch (error) {
        handleFetching(false)
        console.error({ error })
    }
}

submitButton.addEventListener('click', getImages)

inputElement.addEventListener('keypress', function(event) {
  if (event.key === "Enter" && !isFetching) {
    event.preventDefault()
    getImages()
  }
})