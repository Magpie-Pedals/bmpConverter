const imgInput = document.querySelector('#imgInput')
const upload = document.querySelector('#upload')
const outputCode = document.querySelector('#outputCode')
const resContainer = document.querySelector('.results')

async function createResult(file) {
    console.log(`creating result for ${file.name}`)
    const p = new Promise((resolve, reject) => {
        const row = document.createElement('div')
        row.classList.add('row')

        const canvasCol = document.createElement('div')
        row.classList.add('col')

        const txtCol = document.createElement('div')
        row.classList.add('col')

        const canvas = document.createElement('canvas')
        canvas.width = "128px"
        canvas.height = "64px"
        const txt = document.createElement('textarea')
        canvasCol.appendChild(canvas)
        txtCol.appendChild(txt)
        row.appendChild(canvasCol)
        row.appendChild(txt)

        const ctx = canvas.getContext('2d')

        const reader = new FileReader()
        reader.addEventListener('load', function (ev) {
            const data = ev.target.result
            const img = new Image()
            img.src = data
            img.addEventListener('load', function (ev) {
                // canvas.width = img.width
                // canvas.height = img.height
                // if (img.width !== 128 || img.height !== 64) {
                //     console.error(`image ${file.name} size different from 128 x 64`)
                //     reject({ error: true })
                // }
                ctx.drawImage(img, 0, 0)
                const imgData = ctx.getImageData(0, 0, canvas.width, canvas.height);
                const pixels = imgData.data;
                let outPixels = []
                for (let i = 0; i < pixels.length; i += 4) {
                    const red = pixels[i];
                    const green = pixels[i + 1];
                    const blue = pixels[i + 2];
                    const greyScale = (red + green + blue) / (765)
                    outPixels.push(greyScale)
                }
                txt.innerText = `uint8_t img[] = {${outPixels.join(', ')}};`
            })
        })
        reader.readAsDataURL(file)

        resolve(row)
    })

    return p
}

upload.addEventListener('change', async function (ev) {
    let promises = []
    console.log(this.files)
    for (let file of this.files) {
        promises.push(createResult(file))
    }
    let results = await Promise.all(promises)
    for (let res of results) {
        if (res?.error) continue
        else resContainer.appendChild(res)
    }
})