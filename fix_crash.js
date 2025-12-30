Java.perform(function() {
    console.log("========================================");
    console.log("[*] 正在注入 HomeTest V6 (上帝模式)...");

    var GridLayoutManager = Java.use("androidx.recyclerview.widget.GridLayoutManager");
    var MainActivity = Java.use("com.hikvision.home.MainV3ActivityForHomeTest");
    var ArrayList = Java.use("java.util.ArrayList");

    // ============================================================
    // 补丁 1: 布局防崩 (保持)
    // ============================================================
    GridLayoutManager.$init.overload('android.content.Context', 'int').implementation = function(c, n) {
        this.$init(c, n < 1 ? 1 : n);
    };
    GridLayoutManager.setSpanCount.overload('int').implementation = function(n) {
        this.setSpanCount(n < 1 ? 1 : n);
    };

    // ============================================================
    // 补丁 2: 上帝模式 - 注入全量菜单
    // ============================================================
    // 我们需要找到 UserNavigationRes 类。根据代码上下文猜测包名。
    // 如果报错找不到类，请看 JADX 里的 import 部分
    var ResClassString = "com.hikvision.home.bean.UserNavigationRes"; // <--- 这里可能需要根据实际情况调整
    
    var original_a = MainActivity.a.overload('java.util.ArrayList');
    
    original_a.implementation = function(list) {
        console.log("[*] [Patch 2] 拦截初始化 -> 正在构造上帝模式数据...");
        
        try {
            var UserNavigationRes = Java.use(ResClassString);
            var fullList = ArrayList.$new();

            // 构造函数签名可能是 (String code, String name, int icon, int type)
            // 我们根据 switch case 里的 "0" 到 "6" 构造数据
            // 参数: code, name, iconResId (随便填), type (随便填)
            
            console.log("    -> 注入: 消息 (0)");
            fullList.add(UserNavigationRes.$new("0", "消息[Hack]", 0, 1));
            
            console.log("    -> 注入: 培训 (1)");
            fullList.add(UserNavigationRes.$new("1", "培训[Hack]", 0, 1));
            
            console.log("    -> 注入: 工作台 (2)");
            fullList.add(UserNavigationRes.$new("2", "工作台", 0, 1));
            
            console.log("    -> 注入: 视频 (3)");
            fullList.add(UserNavigationRes.$new("3", "视频", 0, 1));
            
            console.log("    -> 注入: 我的 (4)");
            fullList.add(UserNavigationRes.$new("4", "我的", 0, 1));
            
            console.log("    -> 注入: 应用 (5)");
            fullList.add(UserNavigationRes.$new("5", "应用", 0, 1));
            
            console.log("    -> 注入: 待办 (6)");
            fullList.add(UserNavigationRes.$new("6", "待办[Hack]", 0, 1));

            console.log("    -> 全量列表构造完成，发送给 App...");
            original_a.call(this, fullList);

        } catch(e) {
            console.error("[!] 构造 UserNavigationRes 失败: " + e);
            console.log("    尝试回退到 null 方案...");
            original_a.call(this, null);
        }
    };

    // ============================================================
    // 补丁 3: 解除交互屏蔽 (保持)
    // ============================================================
    var original_click = MainActivity.a.overload('boolean', 'int');
    original_click.implementation = function(b, i) {
        console.log("[*] 点击 Tab Index: " + i);
        try { original_click.call(this, b, i); } catch(e) {}
    };

    // ============================================================
    // 补丁 4: 强制激活 Bean (保持)
    // ============================================================
    // 这里的逻辑稍微改一下，确保所有 boolean 都为 true
    try {
        var Bean = Java.use("com.hikvision.home.bean.MainV3BottomBean");
        var overloads = Bean.$init.overloads;
        overloads.forEach(function(overload) {
            overload.implementation = function() {
                for (var i = 0; i < arguments.length; i++) {
                    if (typeof arguments[i] === 'boolean') arguments[i] = true;
                }
                this.$init.apply(this, arguments);
            }
        });
    } catch(e) {}

    console.log("[*] 上帝模式脚本就绪，请重新 am start！");
});