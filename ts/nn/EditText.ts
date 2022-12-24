export class TextCursor {
   private context: CanvasRenderingContext2D;
   private fillStyle: string;
   private width: number;
   private left: number;
   private top: number;

   constructor (context: CanvasRenderingContext2D) {
      this.context = context;
      this.fillStyle   = 'rgba(0, 0, 0, 0.7)';
      this.width       = 2;
      this.left        = 0;
      this.top         = 0;
   }

   public getHeight (): number {
      var h = this.context.measureText('M').width;
      return h + h/2;
   }
      
   private createPath (): void {
      this.context.beginPath();
      this.context.rect(this.left, this.top,
                   this.width, this.getHeight());
   }
   
   public draw (left: number, bottom: number): void {
      this.context.save();

      this.left = left;
      this.top = bottom - this.getHeight();

      this.createPath();

      this.context.fillStyle = this.fillStyle;
      this.context.fill();
         
      this.context.restore();
   }

   public erase (imageData: ImageData): void {
      this.context.putImageData(imageData, 0, 0,
         this.left, this.top,
         this.width, this.getHeight());
   }
}

// Text lines.....................................................

export class TextLine {
   public left: number;
   public bottom: number;
   private context: CanvasRenderingContext2D;
   private text: string;
   private caret: number;

   constructor (context: CanvasRenderingContext2D) {
      this.context = context;
      this.text = '';
      this.left = 0;
      this.bottom = 0;
      this.caret = 0;
   }

   public insert (text: string): void {
      this.text = this.text.substring(0, this.caret) + text +
                  this.text.substring(this.caret);
      this.caret += text.length;
   }

   public removeCharacterBeforeCaret (): void {
      if (this.caret === 0)
         return;

      this.text = this.text.substring(0, this.caret-1) +
                  this.text.substring(this.caret); 

      this.caret--;
   }

   public getWidth (): number {
      return this.context.measureText(this.text).width;
   }

   public getHeight (): number {
      var h = this.context.measureText('W').width;
      return h + h/6;
   }

   public draw (): void {
      this.context.save();
      this.context.textAlign = 'start';
      this.context.textBaseline = 'bottom';
       
      this.context.fillText(this.text, this.left, this.bottom);

      this.context.restore();
   }

   public erase (imageData: ImageData): void {
      this.context.putImageData(imageData, 0, 0);
   }

   // New functions
   public moveTo (left: number, bottom: number): void {
      this.left = left;
      this.bottom = bottom;
   }

   public resetText (): void {
      this.text = '';
      this.caret = 0;
   }
}

