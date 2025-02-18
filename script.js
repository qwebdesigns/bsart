// Добавляем обработчик ползунка
const slider = document.getElementById("pixelSlider");
const img = document.getElementById("myimg");
const canvas = document.getElementById("main_canvas");
const fcanvas = document.getElementById("final_canvas");
const fctx = fcanvas.getContext("2d");
const fcanvas2 = document.getElementById("final_canvas2");
const fctx2 = fcanvas2.getContext("2d");


var slval = document.getElementById("pixelSlider_val");
var ps = slider.value;

const colorData = [{
        name: "ATLAS_SIMPLE_PRAZD_01.gif",
        color: {
            r: 145,
            g: 92,
            b: 63
        }
    },
    {
        name: "ATLAS_SIMPLE_PRAZD_02.gif",
        color: {
            r: 82,
            g: 178,
            b: 57
        }
    },
    {
        name: "ATLAS_SIMPLE_PRAZD_04.gif",
        color: {
            r: 186,
            g: 117,
            b: 20
        }
    },
    {
        name: "ATLAS_SIMPLE_PRAZD_06.gif",
        color: {
            r: 216,
            g: 216,
            b: 216
        }
    },
    {
        name: "ATLAS_SIMPLE_PRAZD_01.gif",
        color: {
            r: 145,
            g: 92,
            b: 63
        }
    },
    {
        name: "ATLAS_SIMPLE_PRAZD_02.gif",
        color: {
            r: 82,
            g: 178,
            b: 57
        }
    },
    {
        name: "ATLAS_SIMPLE_PRAZD_04.gif",
        color: {
            r: 186,
            g: 117,
            b: 20
        }
    },
    {
        name: "ATLAS_SIMPLE_PRAZD_06.gif",
        color: {
            r: 216,
            g: 216,
            b: 216
        }
    },
    {
        name: "ATLAS_SIMPLE_PRAZD_08.gif",
        color: {
            r: 225,
            g: 211,
            b: 158
        }
    },
    {
        name: "ATLAS_SIMPLE_PRAZD_09.gif",
        color: {
            r: 253,
            g: 199,
            b: 133
        }
    },
    {
        name: "ATLAS_SIMPLE_PRAZD_10.gif",
        color: {
            r: 139,
            g: 123,
            b: 115
        }
    },
    {
        name: "ATLAS_SIMPLE_PRAZD_100.gif",
        color: {
            r: 5,
            g: 113,
            b: 218
        }
    },
    {
        name: "ATLAS_SIMPLE_PRAZD_101.gif",
        color: {
            r: 2,
            g: 191,
            b: 216
        }
    },
    {
        name: "ATLAS_SIMPLE_PRAZD_102.gif",
        color: {
            r: 0,
            g: 120,
            b: 0
        }
    },
    {
        name: "ATLAS_SIMPLE_PRAZD_103.gif",
        color: {
            r: 0,
            g: 191,
            b: 19
        }
    },
    {
        name: "ATLAS_SIMPLE_PRAZD_104.gif",
        color: {
            r: 205,
            g: 195,
            b: 4
        }
    },
    {
        name: "ATLAS_SIMPLE_PRAZD_105.gif",
        color: {
            r: 249,
            g: 191,
            b: 119
        }
    },
    {
        name: "ATLAS_SIMPLE_PRAZD_106.gif",
        color: {
            r: 237,
            g: 126,
            b: 6
        }
    },
    {
        name: "ATLAS_SIMPLE_PRAZD_107.gif",
        color: {
            r: 175,
            g: 82,
            b: 8
        }
    },
    {
        name: "ATLAS_SIMPLE_PRAZD_108.gif",
        color: {
            r: 220,
            g: 220,
            b: 220
        }
    },
    {
        name: "ATLAS_SIMPLE_PRAZD_109.gif",
        color: {
            r: 122,
            g: 122,
            b: 122
        }
    },
    {
        name: "ATLAS_SIMPLE_PRAZD_11.gif",
        color: {
            r: 111,
            g: 112,
            b: 111
        }
    },
    {
        name: "ATLAS_SIMPLE_PRAZD_110.gif",
        color: {
            r: 80,
            g: 80,
            b: 80
        }
    },
    {
        name: "ATLAS_SIMPLE_PRAZD_111.gif",
        color: {
            r: 24,
            g: 24,
            b: 24
        }
    },
    {
        name: "ATLAS_SIMPLE_PRAZD_112.gif",
        color: {
            r: 2,
            g: 2,
            b: 2
        }
    },
    {
        name: "ATLAS_SIMPLE_PRAZD_113.gif",
        color: {
            r: 88,
            g: 32,
            b: 4
        }
    },
    {
        name: "ATLAS_SIMPLE_PRAZD_114.gif",
        color: {
            r: 0,
            g: 72,
            b: 2
        }
    },
    {
        name: "ATLAS_SIMPLE_PRAZD_115.gif",
        color: {
            r: 0,
            g: 40,
            b: 72
        }
    },
    {
        name: "ATLAS_SIMPLE_PRAZD_116.gif",
        color: {
            r: 85,
            g: 54,
            b: 3
        }
    },
    {
        name: "ATLAS_SIMPLE_PRAZD_117.gif",
        color: {
            r: 75,
            g: 75,
            b: 75
        }
    },
    {
        name: "ATLAS_SIMPLE_PRAZD_118.gif",
        color: {
            r: 218,
            g: 19,
            b: 16
        }
    },
    {
        name: "ATLAS_SIMPLE_PRAZD_119.gif",
        color: {
            r: 0,
            g: 99,
            b: 2
        }
    },
    {
        name: "ATLAS_SIMPLE_PRAZD_12.gif",
        color: {
            r: 138,
            g: 49,
            b: 7
        }
    },
    {
        name: "ATLAS_SIMPLE_PRAZD_120.gif",
        color: {
            r: 0,
            g: 96,
            b: 190
        }
    },
    {
        name: "ATLAS_SIMPLE_PRAZD_121.gif",
        color: {
            r: 189,
            g: 172,
            b: 3
        }
    },
    {
        name: "ATLAS_SIMPLE_PRAZD_122.gif",
        color: {
            r: 217,
            g: 109,
            b: 3
        }
    },
    {
        name: "ATLAS_SIMPLE_PRAZD_123.gif",
        color: {
            r: 202,
            g: 202,
            b: 202
        }
    },
    {
        name: "ATLAS_SIMPLE_PRAZD_124.gif",
        color: {
            r: 123,
            g: 123,
            b: 123
        }
    },
    {
        name: "ATLAS_SIMPLE_PRAZD_125.gif",
        color: {
            r: 147,
            g: 61,
            b: 47
        }
    },
    {
        name: "ATLAS_SIMPLE_PRAZD_126.gif",
        color: {
            r: 160,
            g: 92,
            b: 26
        }
    },
    {
        name: "ATLAS_SIMPLE_PRAZD_127.gif",
        color: {
            r: 83,
            g: 83,
            b: 83
        }
    },
    {
        name: "ATLAS_SIMPLE_PRAZD_129.gif",
        color: {
            r: 172,
            g: 101,
            b: 73
        }
    },
    {
        name: "ATLAS_SIMPLE_PRAZD_13.gif",
        color: {
            r: 112,
            g: 58,
            b: 31
        }
    },
    {
        name: "ATLAS_SIMPLE_PRAZD_130.gif",
        color: {
            r: 175,
            g: 137,
            b: 123
        }
    },
    {
        name: "ATLAS_SIMPLE_PRAZD_131.gif",
        color: {
            r: 160,
            g: 97,
            b: 52
        }
    },
    {
        name: "ATLAS_SIMPLE_PRAZD_132.gif",
        color: {
            r: 10,
            g: 105,
            b: 147
        }
    },
    {
        name: "ATLAS_SIMPLE_PRAZD_133.gif",
        color: {
            r: 4,
            g: 145,
            b: 46
        }
    },
    {
        name: "ATLAS_SIMPLE_PRAZD_134.gif",
        color: {
            r: 165,
            g: 67,
            b: 54
        }
    },
    {
        name: "ATLAS_SIMPLE_PRAZD_135.gif",
        color: {
            r: 168,
            g: 116,
            b: 44
        }
    },
    {
        name: "ATLAS_SIMPLE_PRAZD_136.gif",
        color: {
            r: 0,
            g: 155,
            b: 38
        }
    },
    {
        name: "ATLAS_SIMPLE_PRAZD_137.gif",
        color: {
            r: 1,
            g: 109,
            b: 157
        }
    },
    {
        name: "ATLAS_SIMPLE_PRAZD_138.gif",
        color: {
            r: 202,
            g: 58,
            b: 24
        }
    },
    {
        name: "ATLAS_SIMPLE_PRAZD_139.gif",
        color: {
            r: 204,
            g: 204,
            b: 204
        }
    },
    {
        name: "ATLAS_SIMPLE_PRAZD_14.gif",
        color: {
            r: 136,
            g: 159,
            b: 182
        }
    },
    {
        name: "ATLAS_SIMPLE_PRAZD_140.gif",
        color: {
            r: 50,
            g: 50,
            b: 50
        }
    },
    {
        name: "ATLAS_SIMPLE_PRAZD_141.gif",
        color: {
            r: 179,
            g: 118,
            b: 70
        }
    },
    {
        name: "ATLAS_SIMPLE_PRAZD_142.gif",
        color: {
            r: 121,
            g: 48,
            b: 39
        }
    },
    {
        name: "ATLAS_SIMPLE_PRAZD_143.gif",
        color: {
            r: 114,
            g: 64,
            b: 19
        }
    },
    {
        name: "ATLAS_SIMPLE_PRAZD_144.gif",
        color: {
            r: 33,
            g: 33,
            b: 33
        }
    },
    {
        name: "ATLAS_SIMPLE_PRAZD_145.gif",
        color: {
            r: 124,
            g: 124,
            b: 124
        }
    },
    {
        name: "ATLAS_SIMPLE_PRAZD_146.gif",
        color: {
            r: 127,
            g: 33,
            b: 32
        }
    },
    {
        name: "ATLAS_SIMPLE_PRAZD_147.gif",
        color: {
            r: 12,
            g: 73,
            b: 12
        }
    },
    {
        name: "ATLAS_SIMPLE_PRAZD_148.gif",
        color: {
            r: 12,
            g: 72,
            b: 113
        }
    },
    {
        name: "ATLAS_SIMPLE_PRAZD_149.gif",
        color: {
            r: 110,
            g: 103,
            b: 24
        }
    },
    {
        name: "ATLAS_SIMPLE_PRAZD_150.gif",
        color: {
            r: 153,
            g: 142,
            b: 107
        }
    },
    {
        name: "ATLAS_SIMPLE_PRAZD_151.gif",
        color: {
            r: 187,
            g: 118,
            b: 118
        }
    },
    {
        name: "ATLAS_SIMPLE_PRAZD_152.gif",
        color: {
            r: 95,
            g: 146,
            b: 103
        }
    },
    {
        name: "ATLAS_SIMPLE_PRAZD_153.gif",
        color: {
            r: 98,
            g: 121,
            b: 146
        }
    },
    {
        name: "ATLAS_SIMPLE_PRAZD_154.gif",
        color: {
            r: 221,
            g: 163,
            b: 104
        }
    },
    {
        name: "ATLAS_SIMPLE_PRAZD_17.gif",
        color: {
            r: 80,
            g: 80,
            b: 80
        }
    },
    {
        name: "ATLAS_SIMPLE_PRAZD_18.gif",
        color: {
            r: 57,
            g: 57,
            b: 57
        }
    },
    {
        name: "ATLAS_SIMPLE_PRAZD_19.gif",
        color: {
            r: 190,
            g: 190,
            b: 190
        }
    },
    {
        name: "ATLAS_SIMPLE_PRAZD_20.gif",
        color: {
            r: 108,
            g: 41,
            b: 22
        }
    },
    {
        name: "ATLAS_SIMPLE_PRAZD_21.gif",
        color: {
            r: 152,
            g: 157,
            b: 144
        }
    },
    {
        name: "ATLAS_SIMPLE_PRAZD_22.gif",
        color: {
            r: 158,
            g: 162,
            b: 161
        }
    },
    {
        name: "ATLAS_SIMPLE_PRAZD_23.gif",
        color: {
            r: 64,
            g: 64,
            b: 64
        }
    },
    {
        name: "ATLAS_SIMPLE_PRAZD_24.gif",
        color: {
            r: 99,
            g: 80,
            b: 4
        }
    },
    {
        name: "ATLAS_SIMPLE_PRAZD_25.gif",
        color: {
            r: 101,
            g: 101,
            b: 101
        }
    },
    {
        name: "ATLAS_SIMPLE_PRAZD_26.gif",
        color: {
            r: 120,
            g: 104,
            b: 45
        }
    },
    {
        name: "ATLAS_SIMPLE_PRAZD_27.gif",
        color: {
            r: 167,
            g: 83,
            b: 0
        }
    },
    {
        name: "ATLAS_SIMPLE_PRAZD_28.gif",
        color: {
            r: 158,
            g: 160,
            b: 158
        }
    },
    {
        name: "ATLAS_SIMPLE_PRAZD_29.gif",
        color: {
            r: 0,
            g: 121,
            b: 18
        }
    },
    {
        name: "ATLAS_SIMPLE_PRAZD_30.gif",
        color: {
            r: 54,
            g: 129,
            b: 144
        }
    },
    {
        name: "ATLAS_SIMPLE_PRAZD_32.gif",
        color: {
            r: 240,
            g: 240,
            b: 240
        }
    },
    {
        name: "ATLAS_SIMPLE_PRAZD_33.gif",
        color: {
            r: 109,
            g: 76,
            b: 38
        }
    },
    {
        name: "ATLAS_SIMPLE_PRAZD_34.gif",
        color: {
            r: 148,
            g: 103,
            b: 55
        }
    },
    {
        name: "ATLAS_SIMPLE_PRAZD_35.gif",
        color: {
            r: 48,
            g: 20,
            b: 1
        }
    },
    {
        name: "ATLAS_SIMPLE_PRAZD_36.gif",
        color: {
            r: 92,
            g: 47,
            b: 9
        }
    },
    {
        name: "ATLAS_SIMPLE_PRAZD_37.gif",
        color: {
            r: 163,
            g: 115,
            b: 64
        }
    },
    {
        name: "ATLAS_SIMPLE_PRAZD_38.gif",
        color: {
            r: 105,
            g: 54,
            b: 12
        }
    },
    {
        name: "ATLAS_SIMPLE_PRAZD_39.gif",
        color: {
            r: 171,
            g: 123,
            b: 69
        }
    },
    {
        name: "ATLAS_SIMPLE_PRAZD_40.gif",
        color: {
            r: 115,
            g: 61,
            b: 14
        }
    },
    {
        name: "ATLAS_SIMPLE_PRAZD_41.gif",
        color: {
            r: 166,
            g: 116,
            b: 65
        }
    },
    {
        name: "ATLAS_SIMPLE_PRAZD_42.gif",
        color: {
            r: 108,
            g: 55,
            b: 13
        }
    },
    {
        name: "ATLAS_SIMPLE_PRAZD_43.gif",
        color: {
            r: 158,
            g: 118,
            b: 70
        }
    },
    {
        name: "ATLAS_SIMPLE_PRAZD_44.gif",
        color: {
            r: 154,
            g: 116,
            b: 70
        }
    },
    {
        name: "ATLAS_SIMPLE_PRAZD_45.gif",
        color: {
            r: 157,
            g: 72,
            b: 20
        }
    },
    {
        name: "ATLAS_SIMPLE_PRAZD_46.gif",
        color: {
            r: 133,
            g: 98,
            b: 57
        }
    },
    {
        name: "ATLAS_SIMPLE_PRAZD_47.gif",
        color: {
            r: 179,
            g: 127,
            b: 31
        }
    },
    {
        name: "ATLAS_SIMPLE_PRAZD_48.gif",
        color: {
            r: 208,
            g: 157,
            b: 58
        }
    },
    {
        name: "ATLAS_SIMPLE_PRAZD_49.gif",
        color: {
            r: 156,
            g: 78,
            b: 77
        }
    },
    {
        name: "ATLAS_SIMPLE_PRAZD_50.gif",
        color: {
            r: 151,
            g: 78,
            b: 78
        }
    },
    {
        name: "ATLAS_SIMPLE_PRAZD_51.gif",
        color: {
            r: 57,
            g: 75,
            b: 96
        }
    },
    {
        name: "ATLAS_SIMPLE_PRAZD_52.gif",
        color: {
            r: 59,
            g: 76,
            b: 96
        }
    },
    {
        name: "ATLAS_SIMPLE_PRAZD_53.gif",
        color: {
            r: 51,
            g: 105,
            b: 58
        }
    },
    {
        name: "ATLAS_SIMPLE_PRAZD_54.gif",
        color: {
            r: 54,
            g: 104,
            b: 61
        }
    },
    {
        name: "ATLAS_SIMPLE_PRAZD_55.gif",
        color: {
            r: 194,
            g: 132,
            b: 65
        }
    },
    {
        name: "ATLAS_SIMPLE_PRAZD_56.gif",
        color: {
            r: 185,
            g: 129,
            b: 67
        }
    },
    {
        name: "ATLAS_SIMPLE_PRAZD_57.gif",
        color: {
            r: 133,
            g: 134,
            b: 133
        }
    },
    {
        name: "ATLAS_SIMPLE_PRAZD_58.gif",
        color: {
            r: 129,
            g: 131,
            b: 129
        }
    },
    {
        name: "ATLAS_SIMPLE_PRAZD_59.gif",
        color: {
            r: 200,
            g: 79,
            b: 74
        }
    },
    {
        name: "ATLAS_SIMPLE_PRAZD_60.gif",
        color: {
            r: 80,
            g: 147,
            b: 121
        }
    },
    {
        name: "ATLAS_SIMPLE_PRAZD_61.gif",
        color: {
            r: 95,
            g: 127,
            b: 148
        }
    },
    {
        name: "ATLAS_SIMPLE_PRAZD_62.gif",
        color: {
            r: 180,
            g: 125,
            b: 81
        }
    },
    {
        name: "ATLAS_SIMPLE_PRAZD_63.gif",
        color: {
            r: 177,
            g: 177,
            b: 177
        }
    },
    {
        name: "ATLAS_SIMPLE_PRAZD_64.gif",
        color: {
            r: 66,
            g: 66,
            b: 66
        }
    },
    {
        name: "ATLAS_SIMPLE_PRAZD_65.gif",
        color: {
            r: 191,
            g: 188,
            b: 182
        }
    },
    {
        name: "ATLAS_SIMPLE_PRAZD_66.gif",
        color: {
            r: 195,
            g: 193,
            b: 187
        }
    },
    {
        name: "ATLAS_SIMPLE_PRAZD_67.gif",
        color: {
            r: 201,
            g: 141,
            b: 45
        }
    },
    {
        name: "ATLAS_SIMPLE_PRAZD_68.gif",
        color: {
            r: 202,
            g: 142,
            b: 46
        }
    },
    {
        name: "ATLAS_SIMPLE_PRAZD_69.gif",
        color: {
            r: 211,
            g: 211,
            b: 211
        }
    },
    {
        name: "ATLAS_SIMPLE_PRAZD_70.gif",
        color: {
            r: 113,
            g: 106,
            b: 93
        }
    },
    {
        name: "ATLAS_SIMPLE_PRAZD_71.gif",
        color: {
            r: 119,
            g: 112,
            b: 96
        }
    },
    {
        name: "ATLAS_SIMPLE_PRAZD_72.gif",
        color: {
            r: 160,
            g: 138,
            b: 113
        }
    },
    {
        name: "ATLAS_SIMPLE_PRAZD_73.gif",
        color: {
            r: 68,
            g: 73,
            b: 44
        }
    },
    {
        name: "ATLAS_SIMPLE_PRAZD_74.gif",
        color: {
            r: 130,
            g: 133,
            b: 133
        }
    },
    {
        name: "ATLAS_SIMPLE_PRAZD_75.gif",
        color: {
            r: 193,
            g: 53,
            b: 46
        }
    },
    {
        name: "ATLAS_SIMPLE_PRAZD_76.gif",
        color: {
            r: 11,
            g: 132,
            b: 91
        }
    },
    {
        name: "ATLAS_SIMPLE_PRAZD_77.gif",
        color: {
            r: 51,
            g: 104,
            b: 126
        }
    },
    {
        name: "ATLAS_SIMPLE_PRAZD_78.gif",
        color: {
            r: 176,
            g: 143,
            b: 37
        }
    },
    {
        name: "ATLAS_SIMPLE_PRAZD_79.gif",
        color: {
            r: 187,
            g: 192,
            b: 192
        }
    },
    {
        name: "ATLAS_SIMPLE_PRAZD_80.gif",
        color: {
            r: 57,
            g: 61,
            b: 61
        }
    },
    {
        name: "ATLAS_SIMPLE_PRAZD_82.gif",
        color: {
            r: 120,
            g: 120,
            b: 120
        }
    },
    {
        name: "ATLAS_SIMPLE_PRAZD_84.gif",
        color: {
            r: 191,
            g: 191,
            b: 191
        }
    },
    {
        name: "ATLAS_SIMPLE_PRAZD_86.gif",
        color: {
            r: 194,
            g: 58,
            b: 27
        }
    },
    {
        name: "ATLAS_SIMPLE_PRAZD_88.gif",
        color: {
            r: 32,
            g: 126,
            b: 52
        }
    },
    {
        name: "ATLAS_SIMPLE_PRAZD_90.gif",
        color: {
            r: 59,
            g: 115,
            b: 122
        }
    },
    {
        name: "ATLAS_SIMPLE_PRAZD_92.gif",
        color: {
            r: 177,
            g: 149,
            b: 72
        }
    },
    {
        name: "ATLAS_SIMPLE_PRAZD_94.gif",
        color: {
            r: 202,
            g: 104,
            b: 0
        }
    },
    {
        name: "ATLAS_SIMPLE_PRAZD_96.gif",
        color: {
            r: 41,
            g: 41,
            b: 41
        }
    },
    {
        name: "ATLAS_SIMPLE_PRAZD_97.gif",
        color: {
            r: 241,
            g: 30,
            b: 21
        }
    },
    {
        name: "ATLAS_SIMPLE_PRAZD_98.gif",
        color: {
            r: 234,
            g: 32,
            b: 117
        }
    },
    {
        name: "ATLAS_SIMPLE_PRAZD_99.gif",
        color: {
            r: 159,
            g: 55,
            b: 186
        }
    },
];

slider.addEventListener("input", function () {
    Toastify({
        text: "Выбрано",
        duration: 3000,
        destination: "https://github.com/apvarun/toastify-js",
        newWindow: true,
        close: false,
        gravity: "top", // `top` or `bottom`
        position: "center", // `left`, `center` or `right`
        stopOnFocus: true, // Prevents dismissing of toast on hover
        style: {
            background: "linear-gradient(to right, #00b09b, #96c93d)",
        },
        onClick: function () {} // Callback after click
    }).showToast();




    ps = this.value;
    slval.textContent = this.value / 2 + "x" + this.value / 2;
    resizecanvas(this.value);
    //pixelate(this.value);
    
});

let ctx, tempCanvas, tempCtx;

function resizecanvas(size) {
    canvas.width = size / 2; //img.naturalWidth;
    canvas.height = size / 2; //img.naturalHeight;
    tempCanvas.width = canvas.width;
    tempCanvas.height = canvas.height;
    fcanvas.width = canvas.width * 32;
    fcanvas.height = canvas.height * 32;
    fcanvas2.width = canvas.width;
    fcanvas2.height = canvas.height;
}
document.getElementById("acceptbutton").addEventListener("click", () => {
    Toastify({
        text: "Обрабатываем <3",
        duration: 3000,
        destination: "https://github.com/apvarun/toastify-js",
        newWindow: true,
        close: false,
        gravity: "top", // `top` or `bottom`
        position: "center", // `left`, `center` or `right`
        stopOnFocus: true, // Prevents dismissing of toast on hover
        style: {
            background: "linear-gradient(to right, #00b09b, #96c93d)",
        },
        onClick: function () {} // Callback after click
    }).showToast();
    ctx = canvas.getContext("2d");

    // Инициализируем временный canvas
    tempCanvas = document.getElementById("temp_canvas");
    tempCtx = tempCanvas.getContext("2d");

    img.onload = () => {
        resizecanvas(ps);
        ctx.drawImage(img, 0, 0);
        pixelate(slider.value);
    };

    if (img.complete) img.onload();
});

// Оптимизированная функция пикселизации с выводом данных
function pixelate(blockSize) {
    const size = blockSize * 0.5;

    // Применяем эффект пикселизации
    tempCtx.clearRect(0, 0, tempCanvas.width, tempCanvas.height);
    tempCtx.drawImage(img, 0, 0, size, size);

    tempCtx.imageSmoothingEnabled = false;
    tempCtx.drawImage(
        tempCanvas,
        0,
        0,
        size,
        size,
        0,
        0,
        tempCanvas.width,
        tempCanvas.height
    );

    ctx.drawImage(tempCanvas, 0, 0);
    analyzePixels();
}

// Получаем и анализируем пиксельные данные

function analyzePixels() {
    const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
    const pixels = imageData.data;
    const pixelArray = [];

    // Анализ с шагом 50 пикселей для демонстрации
    //for (let i = 0; i < pixels.length; i += 200) { // 200 = 50 пикселей * 4
    //    const x = (i / 4) % canvas.width;
    //    const y = Math.floor((i / 4) / canvas.width);

    ////    pixelArray.push({
    //        position: {
    //            x,
    //           y
    //        },
    //        color: `rgba(${pixels[i]}, ${pixels[i+1]}, ${pixels[i+2]}, ${pixels[i+3]})`
    //    });
    //}

    //console.log('Примеры пикселей (каждый 50-й):', pixelArray);

    console.log(
        "Общее количество пикселей при размерах около:",
        canvas.width * canvas.height
    );
    var maxnumpix = canvas.width * canvas.height;
    console.log("RGBA свойств пикселей при размерах итог:", pixels.length);
    var old_pixel = {};
    for (let i = 0; pixelArray.length < maxnumpix; i += 4) {
        const pixel = {
            r: pixels[i],
            g: pixels[i + 1],
            b: pixels[i + 2],
            a: pixels[i + 3],
        };
        if (old_pixel == pixel) {
            return;
        } else {
            pixelArray.push(pixel);
            old_pixel = pixel;
        }
    }
    console.log(pixelArray);




    const matchedPixels = pixelArray.map(pixel => { // Преобразование массива пикселей в новый массив с ближайшими цветами
        let closestColor = null; // Инициализация переменной для хранения ближайшего цвета
        let minDistance = Infinity; // Инициализация минимального расстояния бесконечностью

        colorData.forEach(data => { // Перебор каждого цвета из массива colorData
            const distance = getDistance(pixel, data.color); // Вычисление расстояния от текущего пикселя до текущего цвета
            if (distance < minDistance) { // Если текущее расстояние меньше минимального
                minDistance = distance; // Обновление минимального расстояния
                closestColor = data; // Обновление ближайшего цвета
            }
        });

        return {
            pixel,
            closestColor: closestColor.name
        }; // Возврат объекта с пикселем и названием ближайшего цвета
    });

    console.warn(matchedPixels); // Вывод результата на консоль

    draw_result(matchedPixels);
}

function getDistance(color1, color2) { // Определение функции для вычисления расстояния между двумя цветами
    return Math.sqrt( // Вычисление квадратного корня из суммы квадратов разностей компонент цветов
        Math.pow(color1.r - color2.r, 2) + // Разность красных компонент (r) в квадрате
        Math.pow(color1.g - color2.g, 2) + // Разность зеленых компонент (g) в квадрате
        Math.pow(color1.b - color2.b, 2) // Разность синих компонент (b) в квадрате
    );
}

function draw_result(newpixels) {
    fctx.imageSmoothingEnabled = false;
    var psl = ps / 2;
    const imgSize = 32; // Размер картинки 32x32
    const imgSize2 = 1; // Размер картинки 32x32
    newpixels.forEach((pixel, index) => {
                const img = new Image();
                img.src = './simpatlas/' + pixel.closestColor;

                img.onload = function () {
                    const x = (index % psl) * imgSize; // Вычисление позиции по горизонтали
                    //const x = (index % psl) * imgSize; // Вычисление позиции по горизонтали
                    const y = Math.floor(index / psl) * imgSize; // Вычисление позиции по вертикали
                    fctx.drawImage(img, x, y, imgSize, imgSize);
                    
                };
    });
    newpixels.forEach((pixel, index) => {
                
                const img = new Image();
                img.src = './rgb/' + pixel.closestColor;

                img.onload = function () {
                    const x = (index % psl) * imgSize2; // Вычисление позиции по горизонтали
                    //const x = (index % psl) * imgSize2; // Вычисление позиции по горизонтали
                    const y = Math.floor(index / psl) * imgSize2; // Вычисление позиции по вертикали
                    fctx2.drawImage(img, x, y, imgSize2, imgSize2);

                };
            
    });
    Toastify({
        text: "Готово!",
        duration: 3000,
        destination: "https://github.com/apvarun/toastify-js",
        newWindow: true,
        close: false,
        gravity: "top", // `top` or `bottom`
        position: "center", // `left`, `center` or `right`
        stopOnFocus: true, // Prevents dismissing of toast on hover
        style: {
            background: "linear-gradient(to right, #00b09b, #96c93d)",
        },
        onClick: function () {} // Callback after click
    }).showToast();
    Toastify({
        text: "Кликни на чёрную область!",
        duration: 3000,
        destination: "https://github.com/apvarun/toastify-js",
        newWindow: true,
        close: false,
        gravity: "top", // `top` or `bottom`
        position: "center", // `left`, `center` or `right`
        stopOnFocus: true, // Prevents dismissing of toast on hover
        style: {
            background: "linear-gradient(to right, #00b09b, #96c93d)",
        },
        onClick: function () {} // Callback after click
    }).showToast();
}
