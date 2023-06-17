import numpy as np
import random as rd
import matplotlib.pyplot as plt
from math import *

fig = plt.figure(figsize=(10,10))
scat = plt.figure(figsize=(10,10))

ax3 = plt.axes(projection='3d')

XLEN = 5
YLEN = 5
DIFF = 0.05

ptsx = np.arange(0, XLEN, DIFF)
ptsy = np.arange(0, YLEN, DIFF)
xs, ys = np.meshgrid(ptsx, ptsy)
z_orig = np.random.random((XLEN + 1, YLEN + 1))
z_interped = np.zeros((round((XLEN) / DIFF), round(YLEN / DIFF)))

# z_interped[-1] = z_orig[XLEN - 1]
# z_interped[:, -1] = z_orig[:, YLEN - 1]


def lerp(a, b, t):
    return a + t * (b - a)


def lerp2(ld, rd, lu, ru, tx, ty):
    upmid = lerp(lu, ru, tx)
    dnmid = lerp(ld, rd, tx)
    return lerp(dnmid, upmid, ty)


for i in range(XLEN):
    for si in range(round(1 / DIFF)):  # step i
        for j in range(YLEN):
            for sj in range(round(1 / DIFF)):
                z_interped[i * round(1 / DIFF) + si][j * round(1 / DIFF) + sj] = lerp2(
                    z_orig[i][j], z_orig[i + 1][j], z_orig[i][j + 1],  z_orig[i + 1][j + 1], DIFF * si, DIFF * sj)


ax3.plot_surface(xs, ys, z_interped, rstride=1, cstride=1, alpha=0.7, cmap='gray')

# fig.show()

# plt.scatter(xs[0], , c=z_interped)

plt.show()
