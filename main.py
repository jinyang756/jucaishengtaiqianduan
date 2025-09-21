from fastapi import FastAPI, Request
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import JSONResponse
from passlib.context import CryptContext
import uvicorn
import time

# 导入数据库配置和模型
sqlalchemy = __import__('sqlalchemy')
import database
from database import engine, Base, get_db

# 导入API路由
from api.users import router as users_router

# 创建FastAPI应用
app = FastAPI(
    title="聚财生态基金系统",
    description="专注于绿色金融投资的移动端基金交易平台API",
    version="1.0.0",
    docs_url="/docs",
    redoc_url="/redoc",
)

# 配置CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # 在生产环境中应限制为特定的域名
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# 密码哈希上下文
pwd_context = CryptContext(schemes=["bcrypt"], deprecated="auto")

# 数据库会话依赖项
def get_db():
    db = database.SessionLocal()
    try:
        yield db
    finally:
        db.close()

# 创建数据库表和初始数据
def init_db():
    # 创建所有表
    Base.metadata.create_all(bind=engine)
    
    # 检查是否已有初始用户
    db = database.SessionLocal()
    try:
        # 导入User模型
        from api.users import User
        
        # 检查是否已有用户
        existing_user = db.query(User).first()
        if not existing_user:
            # 创建管理员用户和测试用户
            admin_user = User(
                username="admin",
                password=pwd_context.hash("admin123"),
                email="admin@jucai-fund.com",
                phone="13800138000",
                balance=100000.0
            )
            
            test_user = User(
                username="testuser",
                password=pwd_context.hash("test123"),
                email="test@jucai-fund.com",
                phone="13900139000",
                balance=10000.0
            )
            
            db.add(admin_user)
            db.add(test_user)
            db.commit()
            print("初始用户创建成功")
    finally:
        db.close()

# 自定义OpenAPI文档配置
@app.get("/openapi.json", include_in_schema=False)
async def get_openapi_json():
    return app.openapi()

# 系统端点
@app.get("/")
async def root():
    return {
        "message": "欢迎使用聚财生态基金系统API",
        "version": "1.0.0",
        "docs": "/docs",
        "redoc": "/redoc"
    }

# 健康检查端点
@app.get("/health")
async def health_check():
    return {
        "status": "ok",
        "timestamp": time.time()
    }

# 欢迎信息端点
@app.get("/welcome")
async def welcome(request: Request):
    client_host = request.client.host
    return {
        "message": f"欢迎访问聚财生态基金系统，您的IP是：{client_host}",
        "system_time": time.strftime("%Y-%m-%d %H:%M:%S", time.localtime())
    }

# 错误处理中间件
@app.middleware("http")
async def add_process_time_header(request: Request, call_next):
    start_time = time.time()
    try:
        response = await call_next(request)
    except Exception as e:
        # 记录错误
        print(f"请求处理错误: {str(e)}")
        # 返回通用错误响应
        response = JSONResponse(
            status_code=500,
            content={"detail": "服务器内部错误，请稍后重试"}
        )
    
    # 添加处理时间头部
    process_time = time.time() - start_time
    response.headers["X-Process-Time"] = str(process_time)
    
    return response

# 注册API路由
app.include_router(users_router)

# 可以添加更多的API路由模块
# from api.funds import router as funds_router
# app.include_router(funds_router)

# 应用启动时的钩子函数
@app.on_event("startup")
async def startup_event():
    # 初始化数据库
    init_db()
    print("聚财生态基金系统API服务已启动")

# 应用关闭时的钩子函数
@app.on_event("shutdown")
async def shutdown_event():
    print("聚财生态基金系统API服务已关闭")

# 如果直接运行此文件，则启动服务
if __name__ == "__main__":
    # 初始化数据库
    init_db()
    
    # 启动uvicorn服务器
    uvicorn.run(
        "main:app",
        host="0.0.0.0",
        port=8000,
        reload=True,
        log_level="info"
    )