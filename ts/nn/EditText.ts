/*************************************************************
 *
 *  Copyright (c) 2022 Sandeep Jain
 *
 *  Licensed under the Apache License, Version 2.0 (the "License");
 *  you may not use this file except in compliance with the License.
 *  You may obtain a copy of the License at
 *
 *      http://www.apache.org/licenses/LICENSE-2.0
 *
 *  Unless required by applicable law or agreed to in writing, software
 *  distributed under the License is distributed on an "AS IS" BASIS,
 *  WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 *  See the License for the specific language governing permissions and
 *  limitations under the License.
 */

/**
 * @fileoverview  Contains the TextCursor and TextLine classes, responsible for
 *                canvas based text editing.
 *
 * @author Sandeep Jain
 */

/*****************************************************************/
/**
 * The TextCursor class is responsible for maintaining the position
 * of the cursor, displayed as a short vertical line, where the 
 * text is supposed to be drawn or erased.
 */
export class TextCursor {

   /**
    * The color of the cursor
    */
   private fillStyle: string;

   /**
    * The width of the cursor rectangle
    */
   private width: number;

   /**
    * The horizontal position of the cursor
    */
   private left: number;

   /**
    * The vertical position of the cursor
    */
   private top: number;

   /**
	 * The context object is responsible for all drawing operations on the canvas
	 */
   private context: CanvasRenderingContext2D;

	/**
	 * @param {CanvasRenderingContext2D} context Responsible for all 2 dimensional drawing operations     
	 * @constructor
	 */
   constructor (context: CanvasRenderingContext2D) {
      this.context = context;
      this.fillStyle   = 'rgba(0, 0, 0, 0.7)';
      this.width       = 2;
      this.left        = 0;
      this.top         = 0;
   }

   /**
    * @returns {number} Returns the required height of the cursor
    */
   public getHeight (): number {
      var h = this.context.measureText('M').width;
      return h + h/2;
   }

   /**
    * Called by the draw function; etches out the outline of the rectangle corresponding to the cursor
    */
   private createPath (): void {
      this.context.beginPath();
      this.context.rect(this.left, this.top,
                   this.width, this.getHeight());
   }
   
   /**
    * Draws the cursor
    * 
    * @param {number} left The horizontal position of the cursor
    * @param {number} bottom The vertical position of the bottom of the cursor.
    */
   public draw (left: number, bottom: number): void {
      this.context.save();

      this.left = left;
      this.top = bottom - this.getHeight();

      this.createPath();

      this.context.fillStyle = this.fillStyle;
      this.context.fill();
         
      this.context.restore();
   }

   /**
    * Erases the cursor
    * 
    * @param {ImageData} imageData The image of the blank cursor drawing are which is painted onto the cursor in
    *                              order to erase it. 
    */
   public erase (imageData: ImageData): void {
      this.context.putImageData(imageData, 0, 0,
         this.left, this.top,
         this.width, this.getHeight());
   }
}

/*****************************************************************/
/**
 * The TextLine class represents a line of editable text.
 */
export class TextLine {

   /**
    * The horizontal position of the left side of the beginning of the text
    */
   public left: number;

   /**
    * The vertical position of the bottom of the text
    */
   public bottom: number;

   /**
    * The string of editable text
    */
   private text: string;

   /**
    * The index into the string where the text is supposed to be inserted or removed
    */
   private caret: number;

   /**
	 * The context object is responsible for all drawing operations on the canvas
	 */
   private context: CanvasRenderingContext2D;

	/**
	 * @param {CanvasRenderingContext2D} context Responsible for all 2 dimensional drawing operations     
	 * @constructor
	 */
   constructor (context: CanvasRenderingContext2D) {
      this.context = context;
      this.text = '';
      this.left = 0;
      this.bottom = 0;
      this.caret = 0;
   }

   /**
    * Inserts the string "text" into the existing editable string at the position of the caret
    * 
    * @param {string} text 
    */
   public insert (text: string): void {
      this.text = this.text.substring(0, this.caret) + text +
                  this.text.substring(this.caret);
      this.caret += text.length;
   }

   /**
    * Deletes the character before the caret, in the editable string
    */
   public removeCharacterBeforeCaret (): void {
      if (this.caret === 0)
         return;

      this.text = this.text.substring(0, this.caret-1) +
                  this.text.substring(this.caret); 

      this.caret--;
   }

   /**
    * @returns {number} Returns the width of the text string
    */
   public getWidth (): number {
      return this.context.measureText(this.text).width;
   }

   /**
    * @returns {number} Returns the approximate maximum height of the text string
    */
   public getHeight (): number {
      var h = this.context.measureText('W').width;
      return h + h/6;
   }

   /**
    * Draws the text string
    */
   public draw (): void {
      this.context.save();
      this.context.textAlign = 'start';
      this.context.textBaseline = 'bottom';
       
      this.context.fillText(this.text, this.left, this.bottom);

      this.context.restore();
   }

   /**
    * Erases the entire text string
    * 
    * @param {ImageData} imageData The image of the blank text string, which is painted on to the active
    *                              text string in order to erase it 
    */
   public erase (imageData: ImageData): void {
      this.context.putImageData(imageData, 0, 0);
   }

   /**
    * Sets the left and bottom values of the text string
    * 
    * @param {number} left The left value
    * @param {number} bottom The bottom value
    */
   public moveTo (left: number, bottom: number): void {
      this.left = left;
      this.bottom = bottom;
   }

   /**
    * Resets the text string to a blank value
    */
   public resetText (): void {
      this.text = '';
      this.caret = 0;
   }
}

