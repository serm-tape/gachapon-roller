
class Gachapon extends Phaser.Scene {
  itemList = []
  confWindow = null
  gachaRate = []

  onLoadThumb(index) {
    return (e) => {
      this.textures.once(`addtexture-thumb${index}`, () => {
        const thumb = this.add.image(0,0,`thumb${index}`)
        this.confWindow.add(thumb)
        thumb.displayWidth = 32
        thumb.displayHeight = 32
        thumb.x = 215
        thumb.y = 45 + 32 * index
      })
      this.textures.addBase64(`thumb${index}`, e.target.result)
    }

  }

  onChooseThumb(index) {
    return (e) => {
      const reader = new FileReader()
      reader.onload = this.onLoadThumb(index);
      reader.readAsDataURL(e.target.files[0])
    }
  }

  addItemToList(x, y) {
    const textbox = this.add.dom(x, y, 'input')
    this.confWindow.add(textbox)
    const fileInput = document.createElement('input')
    fileInput.setAttribute('type', 'file')
    fileInput.addEventListener('change', this.onChooseThumb(this.itemList.length))
    fileInput.click()
    this.itemList.push(textbox)
  }

  create() {
    this.add.particles(
      300,
      400, 
      null, 
      {
        speed: 100, 
        scale: {start:1, end:0}, 
        blendMode: 'ADD'
      }
    )
    this.confWindow = this.add.container(0, 100)
    const addButton = this.add.text(10, 10, 'ADD', {backgroundColor: '#00A000'})
      .setInteractive()
      .on('pointerup', () => {this.addItemToList(100, 45 + 32 * this.itemList.length)})
    this.confWindow.add(addButton)

    const goButton = this.add.text(60, 10, 'GO', {backgroundColor: '#A0A000'})
      .setInteractive()
      .on('pointerup', () => console.log('READ CONF and GO'))
    this.confWindow.add(goButton)
  }
}
  
var main = {
  type: Phaser.AUTO,
  width: 800,
  height: 600,
  scene: Gachapon,
  parent: "Phaser",
  dom: {
    createContainer: true
  }
}
  
  