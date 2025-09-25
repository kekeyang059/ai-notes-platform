"use client";

import { motion } from "framer-motion";
import { useState, useEffect } from "react";

interface OlympicRingsProps {
  size?: number;
  animated?: boolean;
  interactive?: boolean;
  onRingClick?: (ringIndex: number) => void;
}

export function OlympicRings({
  size = 200,
  animated = true,
  interactive = false,
  onRingClick
}: OlympicRingsProps) {
  const [isHovered, setIsHovered] = useState(false);

  // 五环的标准位置和颜色
  const rings = [
    { id: 0, x: 0, y: 0, color: "#0085C7", name: "蓝色" },      // 左上角 - 蓝色
    { id: 1, x: 60, y: 0, color: "#F4C300", name: "黄色" },    // 右上角 - 黄色
    { id: 2, x: 120, y: 0, color: "#000000", name: "黑色" },   // 右上角 - 黑色
    { id: 3, x: 30, y: 30, color: "#009F3D", name: "绿色" },   // 左下角 - 绿色
    { id: 4, x: 90, y: 30, color: "#DF0024", name: "红色" },   // 右下角 - 红色
  ];

  const ringRadius = size * 0.15;
  const ringThickness = size * 0.02;

  // 动画变体
  const containerVariants = {
    initial: {
      scale: 0.8,
      opacity: 0,
      rotate: -180
    },
    animate: {
      scale: 1,
      opacity: 1,
      rotate: 0,
      transition: {
        duration: 1.2,
        ease: "easeOut",
        staggerChildren: 0.2,
        delayChildren: 0.3
      }
    },
    hover: {
      scale: 1.05,
      transition: {
        duration: 0.3,
        ease: "easeInOut"
      }
    }
  };

  const ringVariants = {
    initial: {
      pathLength: 0,
      opacity: 0,
      scale: 0.5
    },
    animate: (custom: number) => ({
      pathLength: 1,
      opacity: 1,
      scale: 1,
      transition: {
        pathLength: {
          duration: 1.5,
          ease: "easeInOut",
          delay: custom * 0.2
        },
        opacity: {
          duration: 0.5,
          delay: custom * 0.2
        },
        scale: {
          duration: 0.8,
          ease: "easeOut",
          delay: custom * 0.2
        }
      }
    }),
    hover: (custom: number) => ({
      scale: 1.1,
      rotate: custom * 15,
      transition: {
        duration: 0.3,
        ease: "easeInOut"
      }
    })
  };

  // 环绕动画
  const orbitVariants = {
    animate: (custom: number) => ({
      rotate: 360,
      transition: {
        rotate: {
          duration: 20 + custom * 2,
          ease: "linear",
          repeat: Infinity,
          delay: custom * 0.5
        }
      }
    })
  };

  // 呼吸动画
  const breatheVariants = {
    animate: (custom: number) => ({
      scale: [1, 1.02, 1],
      opacity: [0.8, 1, 0.8],
      transition: {
        duration: 3 + custom * 0.5,
        ease: "easeInOut",
        repeat: Infinity,
        delay: custom * 0.3
      }
    })
  };

  return (
    <motion.div
      className="relative flex items-center justify-center"
      style={{ width: size * 1.5, height: size * 1.2 }}
      variants={containerVariants}
      initial="initial"
      animate="animate"
      whileHover={interactive ? "hover" : undefined}
      onHoverStart={() => setIsHovered(true)}
      onHoverEnd={() => setIsHovered(false)}
    >
      <svg
        width={size * 1.5}
        height={size * 1.2}
        viewBox={`0 0 ${size * 1.5} ${size * 1.2}`}
        className="overflow-visible"
      >
        {rings.map((ring, index) => (
          <motion.g key={ring.id}>
            {/* 环绕轨道 */}
            {animated && (
              <motion.circle
                cx={ring.x + ringRadius}
                cy={ring.y + ringRadius}
                r={ringRadius + 10}
                fill="none"
                stroke={ring.color}
                strokeWidth="0.5"
                opacity="0.1"
                variants={orbitVariants}
                animate="animate"
                custom={index}
              />
            )}

            {/* 主要五环 */}
            <motion.circle
              cx={ring.x + ringRadius}
              cy={ring.y + ringRadius}
              r={ringRadius}
              fill="none"
              stroke={ring.color}
              strokeWidth={ringThickness}
              variants={ringVariants}
              animate="animate"
              custom={index}
              whileHover={interactive ? "hover" : undefined}
              className={interactive ? "cursor-pointer" : ""}
              onClick={() => interactive && onRingClick?.(index)}
              style={{
                filter: isHovered ? `drop-shadow(0 0 8px ${ring.color}40)` : "none",
                transition: "filter 0.3s ease"
              }}
            />

            {/* 内圈发光效果 */}
            {animated && (
              <motion.circle
                cx={ring.x + ringRadius}
                cy={ring.y + ringRadius}
                r={ringRadius - ringThickness}
                fill="none"
                stroke={ring.color}
                strokeWidth={ringThickness * 0.5}
                opacity="0.3"
                variants={breatheVariants}
                animate="animate"
                custom={index}
              />
            )}

            {/* 环与环之间的连接线（体现奥运五环的交织效果） */}
            {index < 2 && (
              <motion.path
                d={`M ${ring.x + ringRadius * 2 - ringThickness} ${ring.y + ringRadius}
                    L ${rings[index + 1].x + ringThickness} ${rings[index + 1].y + ringRadius}`}
                stroke={ring.color}
                strokeWidth={ringThickness * 0.3}
                opacity="0.4"
                variants={{
                  initial: { pathLength: 0 },
                  animate: {
                    pathLength: 1,
                    transition: { duration: 1, delay: 2 + index * 0.3 }
                  }
                }}
              />
            )}

            {index === 2 && (
              <motion.path
                d={`M ${ring.x + ringRadius * 2 - ringThickness} ${ring.y + ringRadius}
                    L ${rings[3].x + ringThickness} ${rings[3].y + ringRadius}`}
                stroke={ring.color}
                strokeWidth={ringThickness * 0.3}
                opacity="0.4"
                variants={{
                  initial: { pathLength: 0 },
                  animate: {
                    pathLength: 1,
                    transition: { duration: 1, delay: 2.6 }
                  }
                }}
              />
            )}

            {index === 3 && (
              <motion.path
                d={`M ${ring.x + ringRadius * 2 - ringThickness} ${ring.y + ringRadius}
                    L ${rings[4].x + ringThickness} ${rings[4].y + ringRadius}`}
                stroke={ring.color}
                strokeWidth={ringThickness * 0.3}
                opacity="0.4"
                variants={{
                  initial: { pathLength: 0 },
                  animate: {
                    pathLength: 1,
                    transition: { duration: 1, delay: 2.9 }
                  }
                }}
              />
            )}
          </motion.g>
        ))}

        {/* 中心光效 */}
        {animated && (
          <motion.circle
            cx={size * 0.75}
            cy={size * 0.6}
            r={ringRadius * 0.3}
            fill="url(#centerGradient)"
            variants={{
              animate: {
                opacity: [0.3, 0.8, 0.3],
                scale: [0.8, 1.2, 0.8],
                transition: {
                  duration: 4,
                  ease: "easeInOut",
                  repeat: Infinity
                }
              }
            }}
            animate="animate"
          />
        )}

        {/* 渐变定义 */}
        <defs>
          <radialGradient id="centerGradient" cx="50%" cy="50%" r="50%">
            <stop offset="0%" stopColor="#ffffff" stopOpacity="0.8" />
            <stop offset="100%" stopColor="#ffffff" stopOpacity="0" />
          </radialGradient>
        </defs>
      </svg>

      {/* 标题文字 */}
      <motion.div
        className="absolute bottom-0 left-0 right-0 text-center"
        variants={{
          initial: { opacity: 0, y: 20 },
          animate: {
            opacity: 1,
            y: 0,
            transition: { duration: 0.8, delay: 3 }
          }
        }}
      >
        <h3 className="text-sm font-semibold text-muted-foreground">
          项目管理
        </h3>
        <p className="text-xs text-muted-foreground mt-1">
          Olympic Rings Style
        </p>
      </motion.div>
    </motion.div>
  );
}