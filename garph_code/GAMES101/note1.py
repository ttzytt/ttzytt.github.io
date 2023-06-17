from manim import *
import numpy as np

def vbypolar(theta, r=1.0) -> np.array:
    return np.array([r*np.cos(theta), r*np.sin(theta), 0]) 

class rotateAlongZ(Scene):
    def construct(self):
        ax = Axes()
        labels = ax.get_axis_labels(x_label='x', y_label='y')
        self.add(ax, labels)
        VXLINE = Line(start=ax.c2p(0, 0), end=ax.c2p(1, 0)) # virtual x line
        VYLINE = Line(start=ax.c2p(0, 0), end=ax.c2p(0, 1)) # virtual y line
        THETA = 30 * DEGREES
        new_x_line = Vector(direction = vbypolar(THETA, 3), color=RED)
        new_y_line = Vector(direction = vbypolar(THETA + 90 * DEGREES, 3), color=BLUE)
        new_x_label = Text("新的 x 轴")
        new_y_label = Text("新的 y 轴")
        new_x_label.move_to(vbypolar(THETA, 3.5)).scale(.5)
        new_y_label.move_to(vbypolar(THETA + 90 * DEGREES, 3.5)).scale(.5)
        self.add(new_x_line, new_y_line, new_x_label, new_y_label)
        newx_ang = Angle(VXLINE, new_x_line, radius=0.5, color=RED)
        self.add(newx_ang, Tex(r"$\theta$").next_to(newx_ang, RIGHT, buff=.1).scale(.7))
        newy_ang = Angle(VXLINE, new_y_line, radius=1, color=BLUE)
        self.add(newy_ang, Tex(r"$\theta + 90^\circ$").next_to(newy_ang, UP, buff=.1).scale(.7))
        newy_oldy_ang = Angle(new_y_line, VYLINE, radius=1.5, color=BLUE, other_angle=True)
        self.add(newy_oldy_ang, Tex(r"$\theta$").next_to(newy_oldy_ang, UP, buff=.1).scale(.7))
        
class rotateAlongY(Scene):
    def construct(self):
        ax = Axes()
        labels = ax.get_axis_labels(x_label='z', y_label='x')
        self.add(ax, labels)
        VXLINE = Line(start=ax.c2p(0, 0), end=ax.c2p(1, 0)) # virtual x line
        VYLINE = Line(start=ax.c2p(0, 0), end=ax.c2p(0, 1)) # virtual y line
        THETA = 30 * DEGREES
        new_x_line = Vector(direction = vbypolar(THETA, 3), color=RED)
        new_y_line = Vector(direction = vbypolar(THETA + 90 * DEGREES, 3), color=BLUE)
        new_x_label = Text("新的 z 轴")
        new_y_label = Text("新的 x 轴")
        new_x_label.move_to(vbypolar(THETA, 3.5)).scale(.5)
        new_y_label.move_to(vbypolar(THETA + 90 * DEGREES, 3.5)).scale(.5)
        self.add(new_x_line, new_y_line, new_x_label, new_y_label)
        newx_ang = Angle(VXLINE, new_x_line, radius=0.5, color=RED)
        self.add(newx_ang, Tex(r"$\theta$").next_to(newx_ang, RIGHT, buff=.1).scale(.7))
        newy_ang = Angle(VXLINE, new_y_line, radius=1, color=BLUE)
        self.add(newy_ang, Tex(r"$\theta + 90^\circ$").next_to(newy_ang, UP, buff=.1).scale(.7))
        newy_oldy_ang = Angle(new_y_line, VYLINE, radius=1.5, color=BLUE, other_angle=True)
        self.add(newy_oldy_ang, Tex(r"$\theta$").next_to(newy_oldy_ang, UP, buff=.1).scale(.7))

class BarycentricTri(Scene):
    def construct(self):
        tri = Triangle().scale(2).rotate(25 * DEGREES)
        ver = tri.get_vertices()
        ver1_label = Text("A").next_to(ver[0], UP).scale(.5)
        ver2_label = Text("B").next_to(ver[1], DOWN).scale(.5)
        ver3_label = Text("C").next_to(ver[2], UP).scale(.5)
        self.add(tri, ver1_label, ver2_label, ver3_label)
        
        pt = Dot(tri.get_center())
        self.add(tri, pt)
        

class BarycentricTriWithM(Scene):
    def construct(self):
        tri = Triangle().scale(2).rotate(25 * DEGREES)
        vers = tri.get_vertices()
        verA_label = Text("A").next_to(vers[0], UP).scale(.5)
        verB_label = Text("B").next_to(vers[1], DOWN).scale(.5)
        verC_label = Text("C").next_to(vers[2], UP).scale(.5)
        self.add(tri, verA_label, verB_label, verC_label)
        
        pt = Dot(tri.get_center())
        self.add(tri, pt)
        mid_pt_val = (vers[1] + vers[2]) / 2
        mid_pt = Dot(mid_pt_val)
        mid_pt_label = Text("M").next_to(mid_pt, DOWN).scale(.5)
        mid_line = Line(start=vers[0], end=mid_pt_val, color=GREEN)
        self.add(mid_line, mid_pt, mid_pt_label)