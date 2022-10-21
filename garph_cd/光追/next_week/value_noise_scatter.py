import numpy as np
import matplotlib.pyplot as plt
from math import *

XLEN = 25 # 产生多少个整数点
YLEN = 25
DIFF = 0.05

ptsx = np.arange(0, XLEN, DIFF)
ptsy = np.arange(0, YLEN, DIFF)
xs, ys = np.meshgrid(ptsx, ptsy)
z_orig = np.random.random((XLEN + 1, YLEN + 1))
z_interped = np.zeros((round((XLEN) / DIFF), round(YLEN / DIFF)))

def lerp(a, b, t):
    return a + t * (b - a)

def lerp2(ld, rd, lu, ru, tx, ty): # 二维线性插值
    upmid = lerp(lu, ru, tx)
    dnmid = lerp(ld, rd, tx)
    return lerp(dnmid, upmid, ty)

for i in range(XLEN):
    for si in range(round(1 / DIFF)):  # step i
        for j in range(YLEN):
            for sj in range(round(1 / DIFF)):
                z_interped[i * round(1 / DIFF) + si][j * round(1 / DIFF) + sj] = lerp2(
                    z_orig[i][j], z_orig[i + 1][j], z_orig[i][j + 1],  z_orig[i + 1][j + 1], DIFF * si, DIFF * sj)


plt.imshow(z_interped, cmap=plt.cm.gray)
plt.savefig("./2d.png", dpi = 150, format = 'png')
plt.show()