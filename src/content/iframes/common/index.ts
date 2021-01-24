export abstract class Iframe {
  width: string
  element: HTMLIFrameElement

  constructor() {
    this.width = '250px'
    this.element = document.createElement("iframe");
    this.element.style.background = "#fff";
    this.element.style.height = "240px";
    this.element.style.width = "0px";
    this.element.style.boxShadow = "0px 2px 4px rgba(0,0,0,0.4)";
    this.element.style.position = "fixed";
    this.element.style.top = "0px";
    this.element.style.right = "0px";
    this.element.style.zIndex = "2147483646";
  }

  isShow(){
    return !(this.element.style.width === "0px")
  }

  hide(){
    this.element.style.width = '0px'
  }

  show(style?: {top?:string, right?:string}){
    this.element.style.width = this.width
    if (typeof style?.top === 'string') {
      this.element.style.top = style.top
    }
    if (typeof style?.right === 'string') {
      this.element.style.right = style.right
    }
  }

  toggle(){
    if(this.element.style.width === "0px") {
      this.show()
    }else {
      this.hide()
    }
  }

  appendChild(){
    document.body.appendChild(this.element)
  }
}