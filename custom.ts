
/**
 * 使用此文件来定义自定义函数和图形块。
 * 想了解更详细的信息，请前往 https://makecode.microbit.org/blocks/custom
 */

/**
 * 自定义图形块
 */
enum PWM
{
    PWM1 = 12,
    PWM2 = 13,
    PWM3 = 14,
    PWM4 = 15
}
//% weight=5 color=#0fbc11 icon="\uf113"
namespace Servo {
    const PCA9685_ADDRESS = 0x40
    const MODE1 = 0x00
    const MODE2 = 0x01
    const SUBADR1 = 0x02
    const SUBADR2 = 0x03
    const SUBADR3 = 0x04
    const PRESCALE = 0xFE
    const LED0_ON_L = 0x06
    const LED0_ON_H = 0x07
    const LED0_OFF_L = 0x08
    const LED0_OFF_H = 0x09
    const ALL_LED_ON_L = 0xFA
    const ALL_LED_ON_H = 0xFB
    const ALL_LED_OFF_L = 0xFC
    const ALL_LED_OFF_H = 0xFD

    const STP_CHA_L = 2047
    const STP_CHA_H = 4095

    const STP_CHB_L = 1
    const STP_CHB_H = 2047

    const STP_CHC_L = 1023
    const STP_CHC_H = 3071

    const STP_CHD_L = 3071
    const STP_CHD_H = 1023

    let initialized = false

    function i2cwrite(addr: number, reg: number, value: number) {
        let buf = pins.createBuffer(2)
        buf[0] = reg
        buf[1] = value
        pins.i2cWriteBuffer(addr, buf)
    }

    function i2cread(addr: number, reg: number) {
        pins.i2cWriteNumber(addr, reg, NumberFormat.UInt8BE);
        let val = pins.i2cReadNumber(addr, NumberFormat.UInt8BE);
        return val;
    }

    function initPCA9685(): void {
        i2cwrite(PCA9685_ADDRESS, MODE1, 0x00)
        setFreq(50);
        for (let idx = 0; idx < 16; idx++) {
            setPwm(idx, 0, 0);
        }
        initialized = true
    }

    function setFreq(freq: number): void {
        // Constrain the frequency
        let prescaleval = 25000000;
        prescaleval /= 4096;
        prescaleval /= freq;
        prescaleval -= 1;
        let prescale = prescaleval; //Math.Floor(prescaleval + 0.5);
        let oldmode = i2cread(PCA9685_ADDRESS, MODE1);
        let newmode = (oldmode & 0x7F) | 0x10; // sleep
        i2cwrite(PCA9685_ADDRESS, MODE1, newmode); // go to sleep
        i2cwrite(PCA9685_ADDRESS, PRESCALE, prescale); // set the prescaler
        i2cwrite(PCA9685_ADDRESS, MODE1, oldmode);
        control.waitMicros(5000);
        i2cwrite(PCA9685_ADDRESS, MODE1, oldmode | 0xa1);
    }

    export function setPwm(channel: number, on: number, off: number): void {
        if (channel < 0 || channel > 15)
            return;

        let buf = pins.createBuffer(5);
        buf[0] = LED0_ON_L + 4 * channel;
        buf[1] = on & 0xff;
        buf[2] = (on >> 8) & 0xff;
        buf[3] = off & 0xff;
        buf[4] = (off >> 8) & 0xff;
        pins.i2cWriteBuffer(PCA9685_ADDRESS, buf);
    }

    export function FullOn(channel: number): void {
        if (!initialized) {
            initPCA9685();
        }
        if (channel < 0 || channel > 15)
            return;

        let buf = pins.createBuffer(5);
        buf[0] = LED0_ON_L + 4 * channel;
        buf[1] = 0x00;
        buf[2] = 0x10;
        buf[3] = 0x00;
        buf[4] = 0x00;
        pins.i2cWriteBuffer(PCA9685_ADDRESS, buf);
    }

    export function FullOff(channel: number): void {
        if (!initialized) {
            initPCA9685();
        }
        if (channel < 0 || channel > 15)
            return;

        let buf = pins.createBuffer(5);
        buf[0] = LED0_ON_L + 4 * channel;
        buf[1] = 0x00;
        buf[2] = 0x00;
        buf[3] = 0x00;
        buf[4] = 0x10;
        pins.i2cWriteBuffer(PCA9685_ADDRESS, buf);
    }

    export function SetLED(led: number, state: boolean): void {
        if (!initialized) {
            initPCA9685();
        }
        if (state) {
            setPwm(led + 9, 0, 4095);
        }
        else {
            setPwm(led + 9, 0, 0);
        }
    }

    /**
     * Servo Execute
     * @param degree [0-180] degree of servo; eg: 90, 0, 180
    */
    //% blockId=setServo block="Servo channel|%channel|degree %degree"
    //% weight=85
    //% degree.min=0 degree.max=180
    export function Servo(channel: PWM, degree: number): void {
        if (!initialized) {
            initPCA9685();
        }
        // 50hz: 20,000 us
        let v_us = (degree * 1800 / 180 + 600); // 0.6 ~ 2.4
        let value = v_us * 4096 / 20000;
        setPwm(channel, 0, value);
    }

    /**
     * Servo Execute
     * @param pulse [500-2500] pulse of servo; eg: 1500, 500, 2500
    */
    //% blockId=setServoPulse block="Servo channel|%channel|pulse %pulse"
    //% weight=85
    //% pulse.min=500 pulse.max=2500
    export function ServoPulse(channel: PWM, pulse: number): void {
        if (!initialized) {
            initPCA9685();
        }
        // 50hz: 20,000 us
        let value = pulse * 4096 / 20000;
        setPwm(channel, 0, value);
    }
}

let GUI_BACKGROUND_COLOR = 1
let FONT_BACKGROUND_COLOR = 1
let FONT_FOREGROUND_COLOR = 0

let LCD_WIDTH = 160  //LCD width
let LCD_HEIGHT = 128 //LCD height

enum COLOR {
    WHITE = 0xFFFF,
    BLACK = 0x0000,
    BLUE = 0x001F,
    BRED = 0XF81F,
    GRED = 0XFFE0,
    GBLUE = 0X07FF,
    RED = 0xF800,
    MAGENTA = 0xF81F,
    GREEN = 0x07E0,
    CYAN = 0x7FFF,
    YELLOW = 0xFFE0,
    BROWN = 0XBC40,
    BRRED = 0XFC07,
    GRAY = 0X8430
}

enum DOT_PIXEL {
    DOT_PIXEL_1 = 1,
    DOT_PIXEL_2,
    DOT_PIXEL_3,
    DOT_PIXEL_4
};

enum LINE_STYLE {
    LINE_SOLID = 0,
    LINE_DOTTED,
};

enum DRAW_FILL {
    DRAW_EMPTY = 0,
    DRAW_FULL,
};


const Font12_Table = hex`000000000000000000000000001010101010000010000000006C48480000000000000000001414287C287C2850500000001038404038487010100000002050200C7008140800000000000018202054483400000000101010100000000000000000080810101010101008080000202010101010101020200000107C1028280000000000000000101010FE10101000000000000000000000181030200000000000007C00000000000000000000000000303000000000040408081010202040000000384444444444443800000000301010101010107C00000000384404081020447C000000003844041804044438000000000C141424447E040E000000003C20203804044438000000001C20407844444438000000007C4404080808101000000000384444384444443800000000384444443C04087000000000000030300000303000000000000018180000183020000000000C10608060100C000000000000007C007C00000000000000C02018041820C00000000000182404081000300000003844444C54544C40443800000030102828287C44EE00000000F8444478444444F8000000003C4440404040443800000000F0484444444448F000000000FC445070504044FC000000007E22283828202070000000003C4440404E44443800000000EE44447C444444EE000000007C1010101010107C000000003C0808084848483000000000EE444850704844E600000000702020202024247C00000000EE6C6C54544444EE00000000EE64645454544CEC0000000038444444444444380000000078242424382020700000000038444444444444381C000000F8444444784844E200000000344C40380404645800000000FE9210101010103800000000EE4444444444443800000000EE4444282828101000000000EE4444545454542800000000C6442810102844C600000000EE44282810101038000000007C4408101020447C0000000038202020202020202038000040202020101008080800000038080808080808080838000010102844000000000000000000000000000000000000FE00100800000000000000000000000038443C44443E00000000C0405864444444F80000000000003C4440404438000000000C04344C4444443E00000000000038447C40403C000000001C207C202020207C000000000000364C4444443C04380000C0405864444444EE00000000100070101010107C00000000100078080808080808700000C0405C48705048DC00000000301010101010107C000000000000E854545454FE000000000000D864444444EE000000000000384444444438000000000000D8644444447840E000000000364C4444443C040E000000006C302020207C0000000000003C44380444780000000000207C202020221C000000000000CC4444444C36000000000000EE4444282810000000000000EE4454545428000000000000CC48303048CC000000000000EE44242818101078000000007C481020447C000000000810101010201010100800001010101010101010100000002010101010081010102000000000000024580000000000`

pins.spiPins(DigitalPin.P15, DigitalPin.P14, DigitalPin.P13)
pins.spiFormat(8, 0)
pins.spiFrequency(18000000)

let LCD_RST = 0;
let LCD_DC = DigitalPin.P8;
let LCD_CS = DigitalPin.P9;
let LCD_BL = 7;

//% weight=20 color=#436EEE icon="\uf108"
namespace LCD {
    //% blockId=LCD_Init
    //% blockGap=8
    //% block="LCD1IN8 Init"
    //% weight=200
    export function LCD_Init(): void {
        control.waitMicros(1000);
        Servo.FullOn(LCD_RST);
        control.waitMicros(1000);
        Servo.FullOff(LCD_RST);
        control.waitMicros(1000);
        Servo.FullOn(LCD_RST);

        //ST7735R Frame Rate
        LCD_WriteReg(0xB1);
        LCD_WriteData_8Bit(0x01);
        LCD_WriteData_8Bit(0x2C);
        LCD_WriteData_8Bit(0x2D);

        LCD_WriteReg(0xB2);
        LCD_WriteData_8Bit(0x01);
        LCD_WriteData_8Bit(0x2C);
        LCD_WriteData_8Bit(0x2D);

        LCD_WriteReg(0xB3);
        LCD_WriteData_8Bit(0x01);
        LCD_WriteData_8Bit(0x2C);
        LCD_WriteData_8Bit(0x2D);
        LCD_WriteData_8Bit(0x01);
        LCD_WriteData_8Bit(0x2C);
        LCD_WriteData_8Bit(0x2D);

        LCD_WriteReg(0xB4); //Column inversion
        LCD_WriteData_8Bit(0x07);

        //ST7735R Power Sequence
        LCD_WriteReg(0xC0);
        LCD_WriteData_8Bit(0xA2);
        LCD_WriteData_8Bit(0x02);
        LCD_WriteData_8Bit(0x84);
        LCD_WriteReg(0xC1);
        LCD_WriteData_8Bit(0xC5);

        LCD_WriteReg(0xC2);
        LCD_WriteData_8Bit(0x0A);
        LCD_WriteData_8Bit(0x00);

        LCD_WriteReg(0xC3);
        LCD_WriteData_8Bit(0x8A);
        LCD_WriteData_8Bit(0x2A);
        LCD_WriteReg(0xC4);
        LCD_WriteData_8Bit(0x8A);
        LCD_WriteData_8Bit(0xEE);

        LCD_WriteReg(0xC5); //VCOM
        LCD_WriteData_8Bit(0x0E);

        //ST7735R Gamma Sequence
        LCD_WriteReg(0xe0);
        LCD_WriteData_8Bit(0x0f);
        LCD_WriteData_8Bit(0x1a);
        LCD_WriteData_8Bit(0x0f);
        LCD_WriteData_8Bit(0x18);
        LCD_WriteData_8Bit(0x2f);
        LCD_WriteData_8Bit(0x28);
        LCD_WriteData_8Bit(0x20);
        LCD_WriteData_8Bit(0x22);
        LCD_WriteData_8Bit(0x1f);
        LCD_WriteData_8Bit(0x1b);
        LCD_WriteData_8Bit(0x23);
        LCD_WriteData_8Bit(0x37);
        LCD_WriteData_8Bit(0x00);
        LCD_WriteData_8Bit(0x07);
        LCD_WriteData_8Bit(0x02);
        LCD_WriteData_8Bit(0x10);

        LCD_WriteReg(0xe1);
        LCD_WriteData_8Bit(0x0f);
        LCD_WriteData_8Bit(0x1b);
        LCD_WriteData_8Bit(0x0f);
        LCD_WriteData_8Bit(0x17);
        LCD_WriteData_8Bit(0x33);
        LCD_WriteData_8Bit(0x2c);
        LCD_WriteData_8Bit(0x29);
        LCD_WriteData_8Bit(0x2e);
        LCD_WriteData_8Bit(0x30);
        LCD_WriteData_8Bit(0x30);
        LCD_WriteData_8Bit(0x39);
        LCD_WriteData_8Bit(0x3f);
        LCD_WriteData_8Bit(0x00);
        LCD_WriteData_8Bit(0x07);
        LCD_WriteData_8Bit(0x03);
        LCD_WriteData_8Bit(0x10);

        LCD_WriteReg(0xF0); //Enable test command
        LCD_WriteData_8Bit(0x01);

        LCD_WriteReg(0xF6); //Disable ram power save mode
        LCD_WriteData_8Bit(0x00);

        LCD_WriteReg(0x3A); //65k mode
        LCD_WriteData_8Bit(0x05);

        LCD_WriteReg(0x36); //MX, MY, RGB mode
        LCD_WriteData_8Bit(0xF7 & 0xA0); //RGB color filter panel

        //sleep out
        LCD_WriteReg(0x11);
        control.waitMicros(1000);

        LCD_WriteReg(0x29);
        //SPIRAM_Set_Mode(SRAM_BYTE_MODE);

        LCD_SetBL(4095);
    }

    //% blockId=LCD_Clear
    //% blockGap=8
    //% block="LCD Clear"
    //% weight=195
    export function LCD_Clear(): void {
        LCD_SetWindows(0, 0, LCD_WIDTH, LCD_HEIGHT);
        LCD_SetColor(0xFFFF, LCD_WIDTH + 2, LCD_HEIGHT + 2);
    }

    //% blockId=LCD_Filling
    //% blockGap=8
    //% block="Filling Color %Color"
    //% weight=195
    export function LCD_Filling(Color: COLOR): void {
        LCD_SetWindows(0, 0, LCD_WIDTH, LCD_HEIGHT);
        LCD_SetColor(Color, LCD_WIDTH + 2, LCD_HEIGHT + 2);
    }

    //% blockId=LCD_SetBL
    //% blockGap=8
    //% block="Set back light level %Lev"
    //% Lev.min=0 Lev.max=4095
    //% weight=180
    export function LCD_SetBL(Lev: number): void {
        Servo.setPwm(LCD_BL, 0, Lev);
    }

    //写寄存器
    function LCD_WriteReg(reg: number): void {
        pins.digitalWritePin(LCD_DC, 0);
        Servo.SetLED(1, true);
        pins.digitalWritePin(LCD_CS, 0);
        pins.spiWrite(reg);
        pins.digitalWritePin(LCD_CS, 1);
        Servo.SetLED(1, false);
    }

    //写8位数据
    function LCD_WriteData_8Bit(Data: number): void {
        pins.digitalWritePin(LCD_DC, 1);
        pins.digitalWritePin(LCD_CS, 0);
        pins.spiWrite(Data);
        pins.digitalWritePin(LCD_CS, 1);
    }

    //写len个16位数据
    function LCD_WriteData_Buf(Buf: number, len: number): void {
        pins.digitalWritePin(LCD_DC, 1);
        pins.digitalWritePin(LCD_CS, 0);
        let i = 0;
        for (i = 0; i < len; i++) {
            pins.spiWrite((Buf >> 8));
            pins.spiWrite((Buf & 0XFF));
        }
        pins.digitalWritePin(LCD_CS, 1);
    }

    //选中区域
    function LCD_SetWindows(Xstart: number, Ystart: number, Xend: number, Yend: number): void {
        //set the X coordinates
        LCD_WriteReg(0x2A);
        LCD_WriteData_8Bit(0x00);
        LCD_WriteData_8Bit((Xstart & 0xff) + 1);
        LCD_WriteData_8Bit(0x00);
        LCD_WriteData_8Bit(((Xend - 1) & 0xff) + 1);

        //set the Y coordinates
        LCD_WriteReg(0x2B);
        LCD_WriteData_8Bit(0x00);
        LCD_WriteData_8Bit((Ystart & 0xff) + 2);
        LCD_WriteData_8Bit(0x00);
        LCD_WriteData_8Bit(((Yend - 1) & 0xff) + 2);

        LCD_WriteReg(0x2C);
    }

    //全屏设置颜色
    function LCD_SetColor(Color: number, Xpoint: number, Ypoint: number,): void {
        LCD_WriteData_Buf(Color, Xpoint * Ypoint);
    }

    //画点在x, y位置画颜色
    function LCD_SetPoint(Xpoint: number, Ypoint: number, Color: number): void {
        LCD_SetWindows(Xpoint, Ypoint, Xpoint + 1, Ypoint + 1);
        LCD_WriteData_8Bit(Color >> 8);
        LCD_WriteData_8Bit(Color & 0xff);
    }


    //% blockId=DrawPoint
    //% blockGap=8
    //% block="Draw Point|x %Xpoint|y %Ypoint|Color %Color|Point Size %Dot_Pixel"
    //% Xpoint.min=1 Xpoint.max=160 Ypoint.min=1 Ypoint.max=128
    //% Color.min=0 Color.max=65535
    //% weight=150
    export function DrawPoint(Xpoint: number, Ypoint: number, Color: number, Dot_Pixel: DOT_PIXEL): void {
        let XDir_Num, YDir_Num;
        for (XDir_Num = 0; XDir_Num < Dot_Pixel; XDir_Num++) {
            for (YDir_Num = 0; YDir_Num < Dot_Pixel; YDir_Num++) {
                LCD_SetPoint(Xpoint + XDir_Num - Dot_Pixel, Ypoint + YDir_Num - Dot_Pixel, Color);
            }
        }
    }

    //% blockId=DrawLine
    //% blockGap=8
    //% block="Draw Line|Xstart %Xstart|Ystart %Ystart|Xend %Xend|Yend %Yend|Color %Color|width %Line_width|Style %Line_Style"
    //% Xstart.min=1 Xstart.max=160 Ystart.min=1 Ystart.max=128
    //% Xend.min=1 Xend.max=160 Yend.min=1 Yend.max=128
    //% Color.min=0 Color.max=65535
    //% weight=140
    export function DrawLine(Xstart: number, Ystart: number, Xend: number, Yend: number, Color: number, Line_width: DOT_PIXEL, Line_Style: LINE_STYLE): void {
        if (Xstart > Xend)
            Swap_AB(Xstart, Xend);
        if (Ystart > Yend)
            Swap_AB(Ystart, Yend);

        let Xpoint = Xstart;
        let Ypoint = Ystart;
        let dx = Xend - Xstart >= 0 ? Xend - Xstart : Xstart - Xend;
        let dy = Yend - Ystart <= 0 ? Yend - Ystart : Ystart - Yend;

        // Increment direction, 1 is positive, -1 is counter;
        let XAddway = Xstart < Xend ? 1 : -1;
        let YAddway = Ystart < Yend ? 1 : -1;

        //Cumulative error
        let Esp = dx + dy;
        let Line_Style_Temp = 0;

        for (; ;) {
            Line_Style_Temp++;
            //Painted dotted line, 2 point is really virtual
            if (Line_Style == LINE_STYLE.LINE_DOTTED && Line_Style_Temp % 3 == 0) {
                DrawPoint(Xpoint, Ypoint, GUI_BACKGROUND_COLOR, Line_width);
                Line_Style_Temp = 0;
            } else {
                DrawPoint(Xpoint, Ypoint, Color, Line_width);
            }
            if (2 * Esp >= dy) {
                if (Xpoint == Xend) break;
                Esp += dy
                Xpoint += XAddway;
            }
            if (2 * Esp <= dx) {
                if (Ypoint == Yend) break;
                Esp += dx;
                Ypoint += YAddway;
            }
        }
    }

    //% blockId=DrawRectangle
    //% blockGap=8
    //% block="Draw Rectangle|Xstart2 %Xstart2|Ystart2 %Ystart2|Xend2 %Xend2|Yend2 %Yend2|Color %Color|Filled %Filled |Line width %Dot_Pixel"
    //% Xstart2.min=1 Xstart2.max=160 Ystart2.min=1 Ystart2.max=128 
    //% Xend2.min=1 Xend2.max=160 Yend2.min=1 Yend2.max=128
    //% Color.min=0 Color.max=65535
    //% weight=130
    export function DrawRectangle(Xstart2: number, Ystart2: number, Xend2: number, Yend2: number, Color: number, Filled: DRAW_FILL, Dot_Pixel: DOT_PIXEL): void {
        if (Xstart2 > Xend2)
            Swap_AB(Xstart2, Xend2);
        if (Ystart2 > Yend2)
            Swap_AB(Ystart2, Yend2);

        let Ypoint = 0;
        if (Filled) {
            for (Ypoint = Ystart2; Ypoint < Yend2; Ypoint++) {
                DrawLine(Xstart2, Ypoint, Xend2, Ypoint, Color, Dot_Pixel, LINE_STYLE.LINE_SOLID);
            }
        } else {
            DrawLine(Xstart2, Ystart2, Xend2, Ystart2, Color, Dot_Pixel, LINE_STYLE.LINE_SOLID);
            DrawLine(Xstart2, Ystart2, Xstart2, Yend2, Color, Dot_Pixel, LINE_STYLE.LINE_SOLID);
            DrawLine(Xend2, Yend2, Xend2, Ystart2, Color, Dot_Pixel, LINE_STYLE.LINE_SOLID);
            DrawLine(Xend2, Yend2, Xstart2, Yend2, Color, Dot_Pixel, LINE_STYLE.LINE_SOLID);
        }
    }

    //% blockId=DrawCircle
    //% blockGap=8
    //% block="Draw Circle|X_Center %X_Center|Y_Center %Y_Center|Radius %Radius|Color %Color|Filled %Draw_Fill|Line width %Dot_Pixel"
    //% X_Center.min=1 X_Center.max=160 Y_Center.min=1 Y_Center.max=128
    //% Radius.min=0 Radius.max=160
    //% Color.min=0 Color.max=65535
    //% weight=120
    export function DrawCircle(X_Center: number, Y_Center: number, Radius: number, Color: number, Draw_Fill: DRAW_FILL, Dot_Pixel: DOT_PIXEL): void {
        //Draw a circle from(0, R) as a starting point
        let XCurrent = 0;
        let YCurrent = Radius;

        //Cumulative error,judge the next point of the logo
        let Esp = 3 - (Radius << 1);

        let sCountY = 0;
        if (Draw_Fill == DRAW_FILL.DRAW_FULL) {//DrawPoint(Xpoint, Ypoint, GUI_BACKGROUND_COLOR, Line_width);
            while (XCurrent <= YCurrent) { //Realistic circles
                for (sCountY = XCurrent; sCountY <= YCurrent; sCountY++) {
                    DrawPoint(X_Center + XCurrent, Y_Center + sCountY, Color, DOT_PIXEL.DOT_PIXEL_1);             //1
                    DrawPoint(X_Center - XCurrent, Y_Center + sCountY, Color, DOT_PIXEL.DOT_PIXEL_1);             //2
                    DrawPoint(X_Center - sCountY, Y_Center + XCurrent, Color, DOT_PIXEL.DOT_PIXEL_1);             //3
                    DrawPoint(X_Center - sCountY, Y_Center - XCurrent, Color, DOT_PIXEL.DOT_PIXEL_1);             //4
                    DrawPoint(X_Center - XCurrent, Y_Center - sCountY, Color, DOT_PIXEL.DOT_PIXEL_1);             //5
                    DrawPoint(X_Center + XCurrent, Y_Center - sCountY, Color, DOT_PIXEL.DOT_PIXEL_1);             //6
                    DrawPoint(X_Center + sCountY, Y_Center - XCurrent, Color, DOT_PIXEL.DOT_PIXEL_1);             //7
                    DrawPoint(X_Center + sCountY, Y_Center + XCurrent, Color, DOT_PIXEL.DOT_PIXEL_1);
                }
                if (Esp < 0)
                    Esp += 4 * XCurrent + 6;
                else {
                    Esp += 10 + 4 * (XCurrent - YCurrent);
                    YCurrent--;
                }
                XCurrent++;
            }
        } else { //Draw a hollow circle
            while (XCurrent <= YCurrent) {
                DrawPoint(X_Center + XCurrent, Y_Center + YCurrent, Color, Dot_Pixel);             //1
                DrawPoint(X_Center - XCurrent, Y_Center + YCurrent, Color, Dot_Pixel);             //2
                DrawPoint(X_Center - YCurrent, Y_Center + XCurrent, Color, Dot_Pixel);             //3
                DrawPoint(X_Center - YCurrent, Y_Center - XCurrent, Color, Dot_Pixel);             //4
                DrawPoint(X_Center - XCurrent, Y_Center - YCurrent, Color, Dot_Pixel);             //5
                DrawPoint(X_Center + XCurrent, Y_Center - YCurrent, Color, Dot_Pixel);             //6
                DrawPoint(X_Center + YCurrent, Y_Center - XCurrent, Color, Dot_Pixel);             //7
                DrawPoint(X_Center + YCurrent, Y_Center + XCurrent, Color, Dot_Pixel);             //0

                if (Esp < 0)
                    Esp += 4 * XCurrent + 6;
                else {
                    Esp += 10 + 4 * (XCurrent - YCurrent);
                    YCurrent--;
                }
                XCurrent++;
            }
        }
    }

    //% blockId=DisplayString
    //% blockGap=8
    //% block="Show String|X %Xchar|Y %Ychar|char %ch|Color %Color"
    //% Xchar.min=1 Xchar.max=160 Ychar.min=1 Ychar.max=128 
    //% Color.min=0 Color.max=65535
    //% weight=100
    export function DisString(Xchar: number, Ychar: number, ch: string, Color: number): void {
        let Xpoint = Xchar;
        let Ypoint = Ychar;
        let Font_Height = 12;
        let Font_Width = 7;
        let ch_len = ch.length;
        let i = 0;
        for (i = 0; i < ch_len; i++) {
            let ch_asicc = ch.charCodeAt(i) - 32;//NULL = 32
            let Char_Offset = ch_asicc * 12;

            if ((Xpoint + Font_Width) > 160) {
                Xpoint = Xchar;
                Ypoint += Font_Height;
            }

            // If the Y direction is full, reposition to(Xstart, Ystart)
            if ((Ypoint + Font_Height) > 128) {
                Xpoint = Xchar;
                Ypoint = Ychar;
            }
            DisChar_1207(Xpoint, Ypoint, Char_Offset, Color);

            //The next word of the abscissa increases the font of the broadband
            Xpoint += Font_Width;
        }
    }

    //% blockId=DisNumber
    //% blockGap=8
    //% block="Show number|X %Xnum|Y %Ynum|number %num|Color %Color"
    //% Xnum.min=1 Xnum.max=160 Ynum.min=1 Ynum.max=128 
    //% Color.min=0 Color.max=65535
    //% weight=100
    export function DisNumber(Xnum: number, Ynum: number, num: number, Color: number): void {
        let Xpoint = Xnum;
        let Ypoint = Ynum;
        DisString(Xnum, Ynum, num + "", Color);
    }

    function DisChar_1207(Xchar: number, Ychar: number, Char_Offset: number, Color: number): void {
        let Page = 0, Column = 0;
        let off = Char_Offset
        for (Page = 0; Page < 12; Page++) {
            for (Column = 0; Column < 7; Column++) {
                if (Font12_Table[off] & (0x80 >> (Column % 8)))
                    LCD_SetPoint(Xchar + Column, Ychar + Page, Color);

                //One pixel is 8 bits
                if (Column % 8 == 7)
                    off++;
            }// Write a line
            if (7 % 8 != 0)
                off++;
        }// Write all
    }

    function Swap_AB(Point1: number, Point2: number): void {
        let Temp = 0;
        Temp = Point1;
        Point1 = Point2;
        Point2 = Temp;
    }
}

let SR_CLK = DigitalPin.P16;
let INSR0_DATA = DigitalPin.P12;        //Data
let INSR_LATCH = 8;

enum KEY {
    IN1 = 0,
    IN2 = 1,
    IN3 = 2,
    IN4 = 3,
    LEFT = 8,
    UP = 9,
    DOWN = 10,
    RIGHT = 11,
    A = 12,
    B = 13,
    MENU = 14,
};

//% weight=20 color=#3333ff icon="\uf11b"
namespace Key {
    let KEYSCAN = 0;
    //% blockID==KeyScan
    //% block="KeyScan"
    //% weight=90
    export function KeyScan(): void {
        pins.setPull(INSR0_DATA, PinPullMode.PullUp)
        Servo.FullOff(INSR_LATCH);
        control.waitMicros(20000);
        Servo.FullOn(INSR_LATCH);
        control.waitMicros(20000);
        KEYSCAN = 0;
        let i = 0;
        for (i = 0; i < 16; i++) {
            KEYSCAN = KEYSCAN << 1;
            let tmp = pins.digitalReadPin(INSR0_DATA);
            KEYSCAN |= tmp;
            pins.digitalWritePin(SR_CLK, 0);
            control.waitMicros(1000);
            pins.digitalWritePin(SR_CLK, 1);
        }
    }

    //% blockID==ReadKey
    //% block="Key %pin |Press"
    //% weight=90
    export function ReadKey(pin: KEY): boolean {
        let res = (KEYSCAN >> pin) & 0x01;
        if (res == 1) {
            return false;
        }
        return true;
    }
}

