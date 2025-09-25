"use client";

import { motion } from "framer-motion";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import {
  FileText,
  CheckSquare,
  Clock,
  MessageSquare,
  FolderOpen,
  PlusCircle,
  Home
} from "lucide-react";

interface NavigationItem {
  id: string;
  icon: React.ComponentType<any>;
  label: string;
  path: string;
  color: string;
  gradient: string;
}

interface CircularNavigationProps {
  size?: number;
  animated?: boolean;
  interactive?: boolean;
}

export function CircularNavigation({
  size = 400,
  animated = true,
  interactive = true
}: CircularNavigationProps) {
  const router = useRouter();
  const [hoveredItem, setHoveredItem] = useState<string | null>(null);
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  const navigationItems: NavigationItem[] = [
    {
      id: "home",
      icon: Home,
      label: "首页",
      path: "/",
      color: "#3B82F6",
      gradient: "from-blue-500 to-blue-600"
    },
    {
      id: "notes",
      icon: FileText,
      label: "笔记",
      path: "/notes",
      color: "#10B981",
      gradient: "from-green-500 to-green-600"
    },
    {
      id: "todos",
      icon: CheckSquare,
      label: "待办",
      path: "/todos",
      color: "#F59E0B",
      gradient: "from-yellow-500 to-yellow-600"
    },
    {
      id: "pomodoro",
      icon: Clock,
      label: "番茄钟",
      path: "/pomodoro",
      color: "#EF4444",
      gradient: "from-red-500 to-red-600"
    },
    {
      id: "ai-chat",
      icon: MessageSquare,
      label: "AI助手",
      path: "/ai-chat",
      color: "#8B5CF6",
      gradient: "from-purple-500 to-purple-600"
    },
    {
      id: "projects",
      icon: FolderOpen,
      label: "项目",
      path: "/projects",
      color: "#06B6D4",
      gradient: "from-cyan-500 to-cyan-600"
    }
  ];

  const centerX = size / 2;
  const centerY = size / 2;
  const radius = size * 0.35;
  const iconSize = size * 0.08;

  const getItemPosition = (index: number, totalItems: number) => {
    const angle = (index * 2 * Math.PI) / totalItems - Math.PI / 2; // 从顶部开始
    const x = centerX + radius * Math.cos(angle);
    const y = centerY + radius * Math.sin(angle);
    return { x, y, angle: angle + Math.PI / 2 };
  };

  // 容器动画变体
  const containerVariants = {
    hidden: {
      scale: 0,
      opacity: 0,
      rotate: -180
    },
    visible: {
      scale: 1,
      opacity: 1,
      rotate: 0,
      transition: {
        duration: 1.2,
        ease: "easeOut",
        staggerChildren: 0.15,
        delayChildren: 0.3
      }
    }
  };

  // 图标项动画变体
  const itemVariants = {
    hidden: (index: number) => ({
      scale: 0,
      opacity: 0,
      x: centerX,
      y: centerY,
      rotate: -360
    }),
    visible: (index: number) => {
      const position = getItemPosition(index, navigationItems.length);
      return {
        scale: 1,
        opacity: 1,
        x: position.x - iconSize / 2,
        y: position.y - iconSize / 2,
        rotate: 0,
        transition: {
          duration: 0.8,
          ease: "easeOut",
          delay: index * 0.1,
          type: "spring",
          stiffness: 200,
          damping: 20
        }
      };
    },
    hover: {
      scale: 1.3,
      rotate: 10,
      transition: {
        duration: 0.3,
        ease: "easeInOut"
      }
    }
  };

  // 中心装饰动画
  const centerVariants = {
    hidden: { scale: 0, opacity: 0 },
    visible: {
      scale: 1,
      opacity: 1,
      transition: {
        duration: 0.8,
        delay: 0.8,
        ease: "easeOut"
      }
    },
    pulse: {
      scale: [1, 1.05, 1],
      opacity: [0.8, 1, 0.8],
      transition: {
        duration: 3,
        ease: "easeInOut",
        repeat: Infinity
      }
    }
  };

  // 轨道动画
  const orbitVariants = {
    animate: (index: number) => ({
      rotate: 360,
      transition: {
        rotate: {
          duration: 15 + index * 2,
          ease: "linear",
          repeat: Infinity,
          delay: index * 0.5
        }
      }
    })
  };

  const handleItemClick = (item: NavigationItem) => {
    if (interactive) {
      router.push(item.path);
    }
  };

  return (
    <div className="relative flex items-center justify-center p-8">
      <motion.div
        className="relative"
        style={{ width: size, height: size }}
        variants={containerVariants}
        initial="hidden"
        animate={isMounted ? "visible" : "hidden"}
      >
        {/* 背景轨道 */}
        {animated && (
          <>
            <motion.div
              className="absolute inset-0 rounded-full border-2 border-dashed border-gray-200 dark:border-gray-700"
              variants={orbitVariants}
              animate="animate"
              custom={0}
            />
            <motion.div
              className="absolute inset-4 rounded-full border border-gray-100 dark:border-gray-800"
              variants={orbitVariants}
              animate="animate"
              custom={1}
            />
          </>
        )}

        {/* 中心装饰 */}
        <motion.div
          className="absolute inset-0 flex items-center justify-center"
          variants={centerVariants}
          initial="hidden"
          animate={["visible", "pulse"]}
        >
          <div className="relative">
            <div className="w-20 h-20 rounded-full bg-gradient-to-br from-blue-500 via-purple-500 to-pink-500 opacity-20 blur-xl" />
            <div className="absolute inset-0 flex items-center justify-center">
              <PlusCircle className="w-8 h-8 text-gray-400 dark:text-gray-600" />
            </div>
          </div>
        </motion.div>

        {/* 导航图标 */}
        {navigationItems.map((item, index) => {
          const position = getItemPosition(index, navigationItems.length);
          return (
            <motion.div
              key={item.id}
              className="absolute"
              style={{
                width: iconSize,
                height: iconSize,
              }}
              variants={itemVariants}
              custom={index}
              initial="hidden"
              animate="visible"
              whileHover={interactive ? "hover" : undefined}
              onHoverStart={() => setHoveredItem(item.id)}
              onHoverEnd={() => setHoveredItem(null)}
              onClick={() => handleItemClick(item)}
            >
              {/* 图标背景 */}
              <motion.div
                className={`w-full h-full rounded-2xl bg-gradient-to-br ${item.gradient} shadow-lg cursor-pointer
                  flex items-center justify-center relative overflow-hidden`}
                whileHover={{ scale: 1.1 }}
                transition={{ duration: 0.2 }}
              >
                {/* 光效 */}
                {hoveredItem === item.id && (
                  <motion.div
                    className="absolute inset-0 bg-white opacity-20"
                    initial={{ x: "-100%" }}
                    animate={{ x: "100%" }}
                    transition={{ duration: 0.6 }}
                  />
                )}

                {/* 图标 */}
                <item.icon
                  className="w-6 h-6 text-white relative z-10"
                  style={{ fontSize: iconSize * 0.4 }}
                />

                {/* 脉冲效果 */}
                {animated && (
                  <motion.div
                    className="absolute inset-0 rounded-2xl"
                    style={{ backgroundColor: item.color }}
                    animate={{
                      scale: [1, 1.5, 1],
                      opacity: [0.3, 0, 0.3]
                    }}
                    transition={{
                      duration: 2,
                      ease: "easeInOut",
                      repeat: Infinity,
                      delay: index * 0.2
                    }}
                  />
                )}
              </motion.div>

              {/* 标签 */}
              <motion.div
                className="absolute -bottom-6 left-1/2 transform -translate-x-1/2 whitespace-nowrap"
                initial={{ opacity: 0, y: -10 }}
                animate={{
                  opacity: hoveredItem === item.id ? 1 : 0.7,
                  y: hoveredItem === item.id ? 0 : 2
                }}
                transition={{ duration: 0.2 }}
              >
                <span className="text-xs font-medium text-gray-600 dark:text-gray-400">
                  {item.label}
                </span>
              </motion.div>

              {/* 连接线到中心 */}
              {animated && (
                <svg
                  className="absolute pointer-events-none"
                  style={{
                    position: 'fixed',
                    left: position.x - iconSize/2,
                    top: position.y - iconSize/2,
                    width: size,
                    height: size,
                    zIndex: -1
                  }}
                >
                  <motion.line
                    x1={iconSize/2}
                    y1={iconSize/2}
                    x2={centerX - position.x + iconSize/2}
                    y2={centerY - position.y + iconSize/2}
                    stroke={item.color}
                    strokeWidth="1"
                    strokeOpacity="0.3"
                    initial={{ pathLength: 0 }}
                    animate={{ pathLength: 1 }}
                    transition={{ duration: 1, delay: index * 0.1 }}
                  />
                </svg>
              )}
            </motion.div>
          );
        })}

        {/* 装饰粒子 */}
        {animated && navigationItems.map((_, index) => {
          const angle = (index * 2 * Math.PI) / navigationItems.length;
          const particleRadius = size * 0.48;
          const x = centerX + particleRadius * Math.cos(angle);
          const y = centerY + particleRadius * Math.sin(angle);

          return (
            <motion.div
              key={`particle-${index}`}
              className="absolute w-2 h-2 rounded-full bg-blue-400"
              style={{ left: x - 4, top: y - 4 }}
              animate={{
                scale: [0, 1, 0],
                opacity: [0, 1, 0]
              }}
              transition={{
                duration: 3,
                ease: "easeInOut",
                repeat: Infinity,
                delay: index * 0.5
              }}
            />
          );
        })}
      </motion.div>

      {/* 标题 */}
      <motion.div
        className="text-center mt-8"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, delay: 1.5 }}
      >
        <h2 className="text-2xl font-bold mb-2">快速导航</h2>
        <p className="text-muted-foreground">点击图标快速访问各功能模块</p>
      </motion.div>
    </div>
  );
}