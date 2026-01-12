import hashlib

def calculate_response():
    # 固定参数
    ha1 = "e60194524afd96c189fa0906c62e4b97"
    qop = "auth"
    algorithm = "MD5"
    
    # 用户输入
    method = input("请输入HTTP方法 (GET/POST): ").upper()
    url = input("请输入URL: ")
    nonce = input("请输入nonce值: ")
    nc = input("请输入nc值: ")
    cnonce = input("请输入cnonce值: ")
    
    # 计算HA2 (method + : + uri)
    ha2_data = f"{method}:{url}"
    ha2 = hashlib.md5(ha2_data.encode('utf-8')).hexdigest()
    
    # 计算response (HA1 + : + nonce + : + nc + : + cnonce + : + qop + : + HA2)
    response_data = f"{ha1}:{nonce}:{nc}:{cnonce}:{qop}:{ha2}"
    response = hashlib.md5(response_data.encode('utf-8')).hexdigest()
    
    print(f"\n计算过程：")
    print(f"HA1 = {ha1} (固定值)")
    print(f"HA2 = MD5('{ha2_data}') = {ha2}")
    print(f"Response = MD5('{response_data}')")
    print(f"\n最终Response值: {response}")

if __name__ == "__main__":
    calculate_response()
