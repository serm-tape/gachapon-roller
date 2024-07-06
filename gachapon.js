
class Gachapon extends Phaser.Scene {
  itemList = []
  confWindow = null
  rollBtn = null

  onChangeName(index) {
    return (e) => {
      this.itemList[index].name = e.target.value
    }
  }

  onChangeRarity(index) {
    return (e) => {
      this.itemList[index].rarity = parseInt(e.target.value)
    }
  }

  onLoadThumb(index) {
    return (e) => {
      this.textures.once(`addtexture-thumb${index}`, () => {
        const thumb = this.add.image(0,0,`thumb${index}`)
        this.confWindow.add(thumb)
        thumb.displayWidth = 32
        thumb.displayHeight = 32
        thumb.x = 200
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
    const textbox = document.createElement('input')
    textbox.setAttribute('style', 'width: 100px')
    const textboxGO = this.add.dom(x, y, textbox)
    this.confWindow.add(textboxGO)
    textbox.addEventListener('change', this.onChangeName(this.itemList.length))
    
    const rarity = document.createElement('input')
    rarity.setAttribute('type', 'number')
    rarity.setAttribute('style', 'width: 50px')
    const rarityGO = this.add.dom(x + 90,y, rarity)
    this.confWindow.add(rarityGO)
    rarity.addEventListener('change', this.onChangeRarity(this.itemList.length))
    
    const fileInput = document.createElement('input')
    fileInput.setAttribute('type', 'file')
    fileInput.addEventListener('change', this.onChooseThumb(this.itemList.length))
    fileInput.click()

    this.itemList.push({name: '', rarity: 0, index:this.itemList.length})
  }

  doRoll() {
    console.log(this.itemList)
    this.rollBtn.visible = false
    const deck = []
    for(let i=0; i<this.itemList.length; i++) {
      for(let j=0; j<this.itemList[i].rarity; j++) {
        deck.push(this.itemList[i])
      }
    }
    Phaser.Utils.Array.Shuffle(deck)
    const rollDuration = 5
    const showDuration = rollDuration/deck.length
    
    const result = Math.floor(Math.random() * deck.length)
    const name = this.add.text(400, 200, deck.name)
    const image = this.add.image(320, 80, `thumb${deck[result].index}`)
    image.displayWidth = 160
    image.displayHeight = 160
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
      .on('pointerup', () => {this.addItemToList(60, 45 + 32 * this.itemList.length)})
    this.confWindow.add(addButton)

    const goButton = this.add.text(60, 10, 'GO', {backgroundColor: '#A0A000'})
    .setInteractive()
    .on('pointerup', () => {
      this.confWindow.visible = false
      this.rollBtn.visible = true
      console.log(this.rollBtn.visible)
    })
    this.confWindow.add(goButton)
    
    this.rollBtn = this.add.text(340, 400, 'ROLL', {backgroundColor: '#35A420'})
      .setInteractive()
      .on('pointerup', this.doRoll.bind(this))
    this.rollBtn.visible = false
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
  
  