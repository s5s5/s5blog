/**
 * 脚本用途：为 src/content/blog 下的 md 文件添加 weather 和 location 信息
 *
 * 根据 id-weatherCode.json 中的 [id, weatherCode, city] 关系，
 * 用 id 找到对应的文件（文件名为 id.md），
 * 在 md 文件的 category 行下插入：
 * - weather 行（使用 weather_code.json 中的中文标签）
 * - location 行（城市名称）
 */

import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// 读取天气代码映射文件
const idWeatherCodePath = path.join(__dirname, "id-weatherCode.json");
const weatherCodePath = path.join(__dirname, "weather_code.json");
const blogDir = path.join(__dirname, "..", "src", "content", "blog");

// 解析 id-weatherCode.json
const idWeatherCodeData = JSON.parse(
  fs.readFileSync(idWeatherCodePath, "utf-8")
);
// 创建 id -> [weatherCode, city] 的映射
const idWeatherMap = {};
idWeatherCodeData.forEach(([id, weatherCode, city]) => {
  idWeatherMap[id] = { weatherCode, city };
});

// 解析 weather_code.json
const weatherCodeData = JSON.parse(fs.readFileSync(weatherCodePath, "utf-8"));
// 创建 weatherCode -> label3 的映射
const weatherLabel3Map = {};
Object.entries(weatherCodeData).forEach(([code, data]) => {
  weatherLabel3Map[code] = data.label;
});

/**
 * 在 markdown 文件的 category 行下插入 weather 和 location 行
 * @param {string} filePath - md 文件路径
 * @param {string} weather - 天气标签
 * @param {string} location - 位置/城市
 */
function addWeatherAndLocation(filePath, weather, location) {
  let content = fs.readFileSync(filePath, "utf-8");

  // 找到 category 行
  const categoryRegex = /^(category:\s*.*)$/m;
  const match = content.match(categoryRegex);

  if (!match) {
    console.warn(`⚠️  文件 ${path.basename(filePath)} 中未找到 category 行`);
    return false;
  }

  const categoryLine = match[0];
  const newLines = `${categoryLine}\nweather: "${weather}"\nlocation: "${location}"`;

  // 替换 category 行
  content = content.replace(categoryRegex, newLines);

  fs.writeFileSync(filePath, content, "utf-8");
  return true;
}

/**
 * 主函数
 */
function main() {
  console.log("📝 开始处理博客文件...\n");

  // 读取 blog 目录下的所有 .md 文件
  const files = fs.readdirSync(blogDir).filter((file) => file.endsWith(".md"));

  let processedCount = 0;
  let skippedCount = 0;

  files.forEach((file) => {
    const id = path.basename(file, ".md");

    // 检查该 id 是否在天气映射中
    if (!idWeatherMap[id]) {
      console.log(`⏭️  跳过: ${file} (未找到天气映射数据)`);
      skippedCount++;
      return;
    }

    const { weatherCode, city } = idWeatherMap[id];

    // 获取天气标签
    const weather = weatherLabel3Map[weatherCode];
    if (!weather) {
      console.warn(
        `⚠️  警告: 无法找到天气代码 ${weatherCode} 的标签 (文件: ${file})`
      );
      skippedCount++;
      return;
    }

    // 处理文件
    const filePath = path.join(blogDir, file);
    const success = addWeatherAndLocation(filePath, weather, city);

    if (success) {
      console.log(`✅ 已处理: ${file} (天气: ${weather}, 位置: ${city})`);
      processedCount++;
    } else {
      skippedCount++;
    }
  });

  console.log(`\n📊 处理完成！`);
  console.log(`✅ 已处理: ${processedCount} 个文件`);
  console.log(`⏭️  已跳过: ${skippedCount} 个文件`);
}

// 执行主函数
main();
