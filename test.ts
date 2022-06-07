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
    if (KeyPad.ReadKey(KEY.IN1)) {
        LCD.DrawCircle(
            randint(0, 160),
            randint(0, 120),
            2,
            randint(0, 65535),
            DRAW_FILL.DRAW_FULL,
            DOT_PIXEL.DOT_PIXEL_1
        )
    }
})