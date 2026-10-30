const fs = require('fs');
const path = require('path');

const indexPath = path.join(__dirname, '..', 'index.html');
let html = fs.readFileSync(indexPath, 'utf8');

console.log('🚀 Đang tích hợp EtsAdaptiveScorer & SoiMayCompanion vào index.html...');

// 1. Thêm script tags vào <head>
const focusScriptTag = '<script src="js/study-focus-engine.js?v=studystudio_20261029_step3_zen"></script>';
const newScriptTags = `<script src="js/study-focus-engine.js?v=studystudio_20261029_step3_zen"></script>
    <script src="js/soi-may-companion.js?v=studystudio_20261030"></script>
    <script src="js/ets-adaptive-scorer.js?v=studystudio_20261030"></script>`;

if (html.includes(focusScriptTag) && !html.includes('js/soi-may-companion.js')) {
    html = html.replace(focusScriptTag, newScriptTags);
    console.log('✅ Đã thêm script tags cho soi-may-companion và ets-adaptive-scorer');
}

// 2. Thêm etsAdaptiveForecastContainer vào Dashboard (Cột phải ngay trước hoặc sau Cân bằng 4 kỹ năng)
const skillBarsHeading = '<h3 class="text-base font-bold text-slate-900 dark:text-white">Cân bằng 4 kỹ năng</h3>';
// Tìm container Cột phải
const rightColMarker = '<div class="lg:col-span-5 space-y-4">';
if (html.includes(rightColMarker) && !html.includes('id="etsAdaptiveForecastContainer"')) {
    html = html.replace(rightColMarker, `${rightColMarker}\n\n                        <!-- KHỐI DỰ BÁO ĐIỂM THÍCH ỨNG ETS (AI IRT ADAPTIVE MODEL) -->\n                        <div id="etsAdaptiveForecastContainer"></div>`);
    console.log('✅ Đã thêm #etsAdaptiveForecastContainer vào Dashboard Cột phải!');
}

// 3. Gọi renderDashboardWidget trong updateDashboardMetrics
const updateHeroMarker = 'if (typeof updateDashboardStudioHero === \'function\') {';
const newMetricsHook = `if (window.EtsAdaptiveScorer && typeof window.EtsAdaptiveScorer.renderDashboardWidget === 'function') {
                window.EtsAdaptiveScorer.renderDashboardWidget();
            }

            if (typeof updateDashboardStudioHero === 'function') {`;

if (html.includes(updateHeroMarker) && !html.includes('window.EtsAdaptiveScorer.renderDashboardWidget();')) {
    html = html.replace(updateHeroMarker, newMetricsHook);
    console.log('✅ Đã thêm hook renderDashboardWidget vào updateDashboardMetrics!');
}

// 4. Gọi renderDashboardWidget trong bootstrapApplication
const bootstrapDailyTask = 'if (window.DailyTaskManager && typeof window.DailyTaskManager.render === \'function\') {';
const newBootstrapHook = `if (window.EtsAdaptiveScorer && typeof window.EtsAdaptiveScorer.renderDashboardWidget === 'function') {
                window.EtsAdaptiveScorer.renderDashboardWidget();
            }

            if (window.DailyTaskManager && typeof window.DailyTaskManager.render === 'function') {`;

if (html.includes(bootstrapDailyTask) && html.indexOf('window.EtsAdaptiveScorer.renderDashboardWidget();') === html.lastIndexOf('window.EtsAdaptiveScorer.renderDashboardWidget();')) {
    html = html.replace(bootstrapDailyTask, newBootstrapHook);
    console.log('✅ Đã thêm hook renderDashboardWidget vào bootstrapApplication!');
}

fs.writeFileSync(indexPath, html, 'utf8');
console.log('🎉 Hoàn tất tích hợp index.html!');
