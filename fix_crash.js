Java.perform(function() {
    console.log("========================================");
    console.log("[*] 正在注入 HomeTest V5 (解锁交互版)...");

    var GridLayoutManager = Java.use("androidx.recyclerview.widget.GridLayoutManager");
    var MainActivity = Java.use("com.hikvision.home.MainV3ActivityForHomeTest");

    // ============================================================
    // 补丁 1: 布局防崩 (保持不变)
    // ============================================================
    GridLayoutManager.$init.overload('android.content.Context', 'int').implementation = function(c, n) {
        this.$init(c, n < 1 ? 1 : n);
    };
    GridLayoutManager.setSpanCount.overload('int').implementation = function(n) {
        this.setSpanCount(n < 1 ? 1 : n);
    };

    // ============================================================
    // 补丁 2: 强行填充数据 (保持不变)
    // ============================================================
    var original_populate = MainActivity.a.overload('java.util.ArrayList');
    original_populate.implementation = function(list) {
        console.log("[*] [Patch 2] 拦截初始化 -> 强行注入默认数据");
        original_populate.call(this, null);
    };

    // ============================================================
    // 补丁 3 (新): 解除点击屏蔽，但增加防崩保护
    // ============================================================
    var original_click_logic = MainActivity.a.overload('boolean', 'int');
    original_click_logic.implementation = function(isRefresh, index) {
        console.log("----------------------------------------");
        console.log("[*] [Patch 3] 点击逻辑被触发！Index: " + index);
        
        try {
            // 【关键】调用原始逻辑，让它去切换 Tab
            console.log("    -> 正在执行切换逻辑...");
            original_click_logic.call(this, isRefresh, index);
            console.log("    -> 切换逻辑执行完毕 (无崩溃)");
        } catch (e) {
            console.error("[!] 切换 Tab 时发生崩溃 (已拦截): " + e);
            console.log("    推测原因: 对应的 Fragment 缺少初始化参数。");
        }
    };

    // ============================================================
    // 侦探: 监控点击监听器 (内部类 d)
    // ============================================================
    // 内部类通常编译为 MainV3ActivityForHomeTest$d
    try {
        var ListenerD = Java.use("com.hikvision.home.MainV3ActivityForHomeTest$d");
        ListenerD.onItemClick.implementation = function(position) {
            console.log("[User Input] 手指点击了第 " + position + " 个图标 (内部类 d 响应)");
            this.onItemClick(position);
        };
    } catch(e) {
        console.log("[!] 未找到内部类 d (可能混淆名不同)，但这不影响 Patch 3 生效。");
    }

    console.log("[*] 脚本 V5 就绪，请点击底部图标！");
    console.log("========================================");
});
