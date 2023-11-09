export default class TryImage {
    async addImageProcess(src){
        let img = new Image();
        img.src = src;
        return img.onload = await function(){
          return this.height;
        }
    }
}