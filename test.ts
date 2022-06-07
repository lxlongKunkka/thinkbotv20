// 在此处添加您的代码
basic.showIcon(IconNames.Heart)
LCD.LCD_Init()
LCD.LCD_Filling(COLOR.BLUE)
music.playMelody("C5 B A G F E D C ", 120)
basic.forever(function() {
    KeyPad.KeyScan()
    if (KeyPad.ReadKey(KEY.A)) {
        LCD.DrawCircle(
            randint(0, 160),
            randint(0, 120),
            2,
            randint(0, 65535),
            DRAW_FILL.DRAW_FULL,
            DOT_PIXEL.DOT_PIXEL_1
        )
    }
    if (KeyPad.ReadKey(KEY.B)) {
        LCD.DrawRectangle(
            randint(0, 160),
            randint(0, 120), 
            randint(0, 160),
            randint(0, 120), 
            randint(0, 65535),
            DRAW_FILL.DRAW_EMPTY, 
            DOT_PIXEL.DOT_PIXEL_1)
    }
    if (KeyPad.ReadKey(KEY.UBIT_A)) {
        LCD.DrawCircle(
            10,
            10,
            2,
            63488,
            DRAW_FILL.DRAW_FULL,
            DOT_PIXEL.DOT_PIXEL_1
        )
    }
    else
    {
        LCD.DrawCircle(
            10,
            10,
            2,
            33840,
            DRAW_FILL.DRAW_FULL,
            DOT_PIXEL.DOT_PIXEL_1
        )
    }

    if (KeyPad.ReadKey(KEY.UBIT_B)) {
        LCD.DrawCircle(
            150,
            10,
            2,
            63488,
            DRAW_FILL.DRAW_FULL,
            DOT_PIXEL.DOT_PIXEL_1
        )
    }
    else {
        LCD.DrawCircle(
            150,
            10,
            2,
            33840,
            DRAW_FILL.DRAW_FULL,
            DOT_PIXEL.DOT_PIXEL_1
        )
    }

    if (KeyPad.ReadKey(KEY.UP)) {
        Motor.forward(200, 100)
    }
    if (KeyPad.ReadKey(KEY.DOWN)) {
        Motor.back(200, 100)
    }
    if (KeyPad.ReadKey(KEY.LEFT)) {
        Motor.left(200, 100)
    }
    if (KeyPad.ReadKey(KEY.RIGHT)) {
        Motor.right(200, 100)
    }
})
basic.forever(function() {
    ExtraLed.LED_TOGGLE(LEDS.LED0)
    ExtraLed.LED_TOGGLE(LEDS.LED1)
    ExtraLed.LED_TOGGLE(LEDS.LED2)
    ExtraLed.LED_TOGGLE(LEDS.LED3)
    basic.pause(500)
})