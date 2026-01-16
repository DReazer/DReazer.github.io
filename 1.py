import hashlib
import base64
import binascii

def login_encrypt_simulation():
    # --- 1. 输入参数定义 ---
    e = "whcstor13579+"      # 密码
    t = "JT1s3GFm5Rz1"       # PBKDF2 盐 (Salt)
    s = 5000                 # 迭代次数 (Iterations)
    a = "M3b4YQ95VwM0c5GR"   # SHA256 盐 (Salt)

    print(f"[*] 初始化参数:\n    Password: {e}\n    Salt1: {t}\n    Iterations: {s}\n    Salt2: {a}\n")

    # --- 2. 第一步：PBKDF2 计算 (生成 p1) ---
    # JS: o.a.PBKDF2(e, t, { keySize: 4, iterations: n })
    # 关键点转换:
    # 1. CryptoJS keySize: 4 words = 16 bytes (128 bits)
    # 2. CryptoJS PBKDF2 默认算法通常是 SHA1 (除非显式指定了 hasher)
    
    dk = hashlib.pbkdf2_hmac(
        hash_name='sha1',          # 对应 JS 默认行为
        password=e.encode('utf-8'),
        salt=t.encode('utf-8'),
        iterations=s,
        dklen=16                   # 对应 keySize: 4
    )
    
    # JS 逻辑: .toString() -> HexToBase64()
    # 在 Python 中，dk 已经是 bytes，直接转 Base64 即可等效于 Hex -> Base64
    p1 = base64.b64encode(dk).decode('utf-8')
    
    print(f"[+] p1 (PBKDF2 result): {p1}")

    # --- 3. 第二步：SHA256 计算 (生成 p2) ---
    # JS: sha256(o, a) -> SHA256(e + t) -> p1 + a
    
    input_str = p1 + a
    
    # 计算 SHA256
    sha256_hash = hashlib.sha256(input_str.encode('utf-8'))
    
    # JS 逻辑: .toString() 得到 Hex 字符串
    hex_result = sha256_hash.hexdigest()
    
    # JS 逻辑: HexToBase64(n)
    # Python 模拟: Hex String -> Bytes -> Base64 String
    p2_bytes = binascii.unhexlify(hex_result)
    p2 = base64.b64encode(p2_bytes).decode('utf-8')

    print(f"[+] p2 (SHA256 result): {p2}")
    
    return {"p1": p1, "p2": p2}

if __name__ == "__main__":
    result = login_encrypt_simulation()
    print("\n[-] 最终结果 JSON:")
    print(result)