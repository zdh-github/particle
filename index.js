class Particle {
    constructor(selector, options) {
        const merge = Object.assign({
            density: 100,
            radius: 5,
            color: "#20BCFC",
            connect: 150
        }, options);
        this.canvas = document.querySelector(selector);
        this.canvas.width = window.innerWidth;
        this.canvas.height = window.innerHeight;
        this.width = this.canvas.width;
        this.height = this.canvas.height;
        this.connect = merge.connect;
        this.context = this.canvas.getContext("2d");
        this.balls = [];
        this.radius = merge.radius;
        this.color = merge.color;
        while (merge.density > 0) {
            merge.density -= 1;
            this.balls.push({
                x: this.random(this.radius, this.width - this.radius),
                y: this.random(this.radius, this.height - this.radius),
                radius: this.random(2, this.radius),
                xSpeed: this.random(0, 2) ? 1 : -1,
                ySpeed: this.random(0, 2) ? 1 : -1,
                radiusSpeed: this.random(0, 2) ? 0.05 : -0.05
            });
        }
        this.animate();
    }

    // 根据最小值和最大值生成随机数
    random(min, max) {
        return Math.floor(Math.random() * (max - min)) + min;
    }

    // 返回两点之间的直线距离
    computeTwoPointDistance(startX, startY, endX, endY) {
        return Math.sqrt(
            Math.pow(endX - startX, 2) + Math.pow(endY - startY, 2)
        );
    }

    // 绘制
    draw() {
        this.context.clearRect(0, 0, this.width, this.height);
        this.balls.forEach((item, index) => {
            if (item.x <= item.radius) {
                item.xSpeed = 1;
            }
            if (item.x >= this.width - item.radius) {
                item.xSpeed = -1;
            }
            if (item.y <= item.radius) {
                item.ySpeed = 1;
            }
            if (item.y >= this.height - item.radius) {
                item.ySpeed = -1;
            }
            if (item.radius <= 2) {
                item.radiusSpeed = 0.05;
            }
            if (item.radius >= this.radius) {
                item.radiusSpeed = -0.05;
            }
            item.x += item.xSpeed;
            item.y += item.ySpeed;
            item.radius += item.radiusSpeed;
            this.balls.forEach((subItem, subIndex) => {
                if (index !== subIndex) {
                    if (
                        this.computeTwoPointDistance(
                            item.x,
                            item.y,
                            subItem.x,
                            subItem.y
                        ) < this.connect
                    ) {
                        this.context.beginPath();
                        this.context.moveTo(item.x, item.y);
                        this.context.lineTo(subItem.x, subItem.y);
                        this.context.strokeStyle = this.color;
                        this.context.lineWidth = 0.1;
                        this.context.stroke();
                    }
                }
            });
            this.context.beginPath();
            this.context.arc(
                item.x,
                item.y,
                item.radius,
                0,
                Math.PI * 2
            );
            this.context.fillStyle = this.color;
            this.context.shadowBlur = 10;
            this.context.shadowColor = "#fff";
            this.context.fill();
        });
    }

    // 动画
    animate() {
        this.draw();
        this.rid = requestAnimationFrame(() => this.animate());
    }

    // 销毁
    destroy() {
        cancelAnimationFrame(this.rid);
    }
}

const particle = new Particle("canvas");
