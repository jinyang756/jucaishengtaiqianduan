from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from passlib.context import CryptContext
from pydantic import BaseModel
from typing import Optional, List
import re
import time
from datetime import datetime
import database

# 创建路由对象
router = APIRouter(
    prefix="/api/users",
    tags=["users"],
)

# 密码哈希上下文
pwd_context = CryptContext(schemes=["bcrypt"], deprecated="auto")

# 用户模型定义
class User(database.Base):
    __tablename__ = "users"
    
    id = database.Column(database.Integer, primary_key=True, index=True)
    username = database.Column(database.String(50), unique=True, index=True)
    password = database.Column(database.String(255))
    email = database.Column(database.String(100), unique=True, index=True)
    phone = database.Column(database.String(20))
    created_at = database.Column(database.DateTime, default=datetime.utcnow)
    last_login = database.Column(database.DateTime)
    status = database.Column(database.Integer, default=1)
    balance = database.Column(database.Float, default=0.0)
    
    # 关系
    personal_profile = database.relationship("PersonalProfile", back_populates="user", uselist=False)
    notifications = database.relationship("Notification", back_populates="user")
    withdrawals = database.relationship("Withdrawal", back_populates="user")

# 个人资料模型
def personal_profile_model():
    class PersonalProfile(database.Base):
        __tablename__ = "personal_profiles"
        
        id = database.Column(database.Integer, primary_key=True, index=True)
        user_id = database.Column(database.Integer, database.ForeignKey("users.id"), unique=True)
        avatar = database.Column(database.String(255))
        real_name = database.Column(database.String(50))
        id_card = database.Column(database.String(20))
        bank_account = database.Column(database.String(50))
        bank_name = database.Column(database.String(100))
        address = database.Column(database.String(255))
        risk_level = database.Column(database.Integer, default=3)  # 1-5，表示风险承受能力
        
        user = database.relationship("User", back_populates="personal_profile")
    return PersonalProfile

PersonalProfile = personal_profile_model()

# 通知模型
def notification_model():
    class Notification(database.Base):
        __tablename__ = "notifications"
        
        id = database.Column(database.Integer, primary_key=True, index=True)
        user_id = database.Column(database.Integer, database.ForeignKey("users.id"))
        title = database.Column(database.String(100))
        content = database.Column(database.Text)
        type = database.Column(database.String(20))  # system, transaction, message
        read = database.Column(database.Boolean, default=False)
        created_at = database.Column(database.DateTime, default=datetime.utcnow)
        
        user = database.relationship("User", back_populates="notifications")
    return Notification

Notification = notification_model()

# 提现记录模型
def withdrawal_model():
    class Withdrawal(database.Base):
        __tablename__ = "withdrawals"
        
        id = database.Column(database.Integer, primary_key=True, index=True)
        user_id = database.Column(database.Integer, database.ForeignKey("users.id"))
        amount = database.Column(database.Float)
        status = database.Column(database.String(20), default="pending")  # pending, approved, rejected
        bank_account = database.Column(database.String(50))
        bank_name = database.Column(database.String(100))
        created_at = database.Column(database.DateTime, default=datetime.utcnow)
        processed_at = database.Column(database.DateTime)
        
        user = database.relationship("User", back_populates="withdrawals")
    return Withdrawal

Withdrawal = withdrawal_model()

# 请求模型
class UserCreate(BaseModel):
    username: str
    password: str
    email: str
    phone: Optional[str] = None

class UserLogin(BaseModel):
    username: str
    password: str

class UserUpdate(BaseModel):
    email: Optional[str] = None
    phone: Optional[str] = None

# 个人资料请求模型
class PersonalProfileUpdate(BaseModel):
    avatar: Optional[str] = None
    real_name: Optional[str] = None
    id_card: Optional[str] = None
    bank_account: Optional[str] = None
    bank_name: Optional[str] = None
    address: Optional[str] = None
    risk_level: Optional[int] = None

# 提现请求模型
class WithdrawalRequest(BaseModel):
    amount: float
    bank_account: str
    bank_name: str

# 通知标记已读请求模型
class NotificationRead(BaseModel):
    notification_ids: List[int]

# 响应模型
class UserResponse(BaseModel):
    id: int
    username: str
    email: str
    phone: Optional[str] = None
    created_at: datetime
    balance: float

    class Config:
        orm_mode = True

class TokenResponse(BaseModel):
    access_token: str
    token_type: str
    user: UserResponse

class PersonalProfileResponse(BaseModel):
    id: int
    user_id: int
    avatar: Optional[str] = None
    real_name: Optional[str] = None
    id_card: Optional[str] = None
    bank_account: Optional[str] = None
    bank_name: Optional[str] = None
    address: Optional[str] = None
    risk_level: int

    class Config:
        orm_mode = True

class NotificationResponse(BaseModel):
    id: int
    title: str
    content: str
    type: str
    read: bool
    created_at: datetime

    class Config:
        orm_mode = True

class WithdrawalResponse(BaseModel):
    id: int
    amount: float
    status: str
    bank_account: str
    bank_name: str
    created_at: datetime
    processed_at: Optional[datetime] = None

    class Config:
        orm_mode = True

# 密码验证函数
def verify_password(plain_password, hashed_password):
    return pwd_context.verify(plain_password, hashed_password)

# 密码哈希函数
def get_password_hash(password):
    return pwd_context.hash(password)

# 用户名验证函数
def validate_username(username):
    # 用户名长度检查
    if len(username) < 3 or len(username) > 20:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="用户名长度必须在3-20个字符之间"
        )
    # 用户名格式检查
    if not re.match(r'^[a-zA-Z0-9_]+$', username):
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="用户名只能包含字母、数字和下划线"
        )

# 密码验证函数
def validate_password(password):
    # 密码长度检查
    if len(password) < 6:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="密码长度不能少于6个字符"
        )

# 邮箱验证函数
def validate_email(email):
    # 邮箱格式检查
    if not re.match(r'^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$', email):
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="邮箱格式不正确"
        )

# 注册用户
@router.post("/register", response_model=UserResponse)
async def register_user(user: UserCreate, db: Session = Depends(database.get_db)):
    # 验证输入
    validate_username(user.username)
    validate_password(user.password)
    validate_email(user.email)
    
    # 检查用户名是否已存在
    db_user = db.query(User).filter(User.username == user.username).first()
    if db_user:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="用户名已存在"
        )
    
    # 检查邮箱是否已存在
    db_email = db.query(User).filter(User.email == user.email).first()
    if db_email:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="邮箱已被注册"
        )
    
    # 创建新用户
    hashed_password = get_password_hash(user.password)
    db_user = User(
        username=user.username,
        password=hashed_password,
        email=user.email,
        phone=user.phone,
        created_at=datetime.utcnow(),
        balance=0.0  # 初始余额为0
    )
    
    # 添加到数据库
    db.add(db_user)
    db.commit()
    db.refresh(db_user)
    
    return db_user

# 用户登录
@router.post("/login", response_model=TokenResponse)
async def login_user(user: UserLogin, db: Session = Depends(database.get_db)):
    # 查找用户
    db_user = db.query(User).filter(User.username == user.username).first()
    
    # 验证用户和密码
    if not db_user or not verify_password(user.password, db_user.password):
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="用户名或密码错误",
            headers={"WWW-Authenticate": "Bearer"}
        )
    
    # 更新最后登录时间
    db_user.last_login = datetime.utcnow()
    db.commit()
    
    # 生成访问令牌（这里简单使用时间戳作为示例）
    access_token = str(time.time()) + ":" + str(db_user.id)
    
    return {
        "access_token": access_token,
        "token_type": "bearer",
        "user": db_user
    }

# 获取用户信息
@router.get("/me", response_model=UserResponse)
async def get_user(user_id: int, db: Session = Depends(database.get_db)):
    # 查找用户
    db_user = db.query(User).filter(User.id == user_id).first()
    
    # 检查用户是否存在
    if not db_user:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="用户不存在"
        )
    
    return db_user

# 更新用户信息
@router.put("/me", response_model=UserResponse)
async def update_user(
    user_id: int,
    user: UserUpdate,
    db: Session = Depends(database.get_db)
):
    # 查找用户
    db_user = db.query(User).filter(User.id == user_id).first()
    
    # 检查用户是否存在
    if not db_user:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="用户不存在"
        )
    
    # 更新用户信息
    if user.email:
        validate_email(user.email)
        # 检查邮箱是否已被其他用户使用
        existing_email = db.query(User).filter(
            User.email == user.email,
            User.id != user_id
        ).first()
        if existing_email:
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail="邮箱已被其他用户使用"
            )
        db_user.email = user.email
    
    if user.phone:
        db_user.phone = user.phone
    
    # 提交更改
    db.commit()
    db.refresh(db_user)
    
    return db_user

# 获取个人资料
@router.get("/me/profile", response_model=PersonalProfileResponse)
async def get_personal_profile(user_id: int, db: Session = Depends(database.get_db)):
    # 查找用户
    db_user = db.query(User).filter(User.id == user_id).first()
    if not db_user:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="用户不存在"
        )
    
    # 查找或创建个人资料
    profile = db.query(PersonalProfile).filter(PersonalProfile.user_id == user_id).first()
    if not profile:
        # 创建默认个人资料
        profile = PersonalProfile(user_id=user_id)
        db.add(profile)
        db.commit()
        db.refresh(profile)
    
    return profile

# 更新个人资料
@router.put("/me/profile", response_model=PersonalProfileResponse)
async def update_personal_profile(
    user_id: int,
    profile_data: PersonalProfileUpdate,
    db: Session = Depends(database.get_db)
):
    # 查找用户
    db_user = db.query(User).filter(User.id == user_id).first()
    if not db_user:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="用户不存在"
        )
    
    # 查找或创建个人资料
    profile = db.query(PersonalProfile).filter(PersonalProfile.user_id == user_id).first()
    if not profile:
        profile = PersonalProfile(user_id=user_id)
        db.add(profile)
    
    # 更新个人资料
    if profile_data.avatar is not None:
        profile.avatar = profile_data.avatar
    if profile_data.real_name is not None:
        profile.real_name = profile_data.real_name
    if profile_data.id_card is not None:
        profile.id_card = profile_data.id_card
    if profile_data.bank_account is not None:
        profile.bank_account = profile_data.bank_account
    if profile_data.bank_name is not None:
        profile.bank_name = profile_data.bank_name
    if profile_data.address is not None:
        profile.address = profile_data.address
    if profile_data.risk_level is not None:
        profile.risk_level = profile_data.risk_level
    
    # 提交更改
    db.commit()
    db.refresh(profile)
    
    return profile

# 获取通知列表
@router.get("/me/notifications", response_model=List[NotificationResponse])
async def get_notifications(
    user_id: int,
    read: Optional[bool] = None,
    type: Optional[str] = None,
    limit: int = 20,
    offset: int = 0,
    db: Session = Depends(database.get_db)
):
    # 查找用户
    db_user = db.query(User).filter(User.id == user_id).first()
    if not db_user:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="用户不存在"
        )
    
    # 构建查询
    query = db.query(Notification).filter(Notification.user_id == user_id)
    
    # 过滤已读/未读
    if read is not None:
        query = query.filter(Notification.read == read)
    
    # 过滤通知类型
    if type is not None:
        query = query.filter(Notification.type == type)
    
    # 分页和排序
    notifications = query.order_by(Notification.created_at.desc()).offset(offset).limit(limit).all()
    
    return notifications

# 获取单个通知详情
@router.get("/me/notifications/{notification_id}", response_model=NotificationResponse)
async def get_notification_detail(
    user_id: int,
    notification_id: int,
    db: Session = Depends(database.get_db)
):
    # 查找通知
    notification = db.query(Notification).filter(
        Notification.id == notification_id,
        Notification.user_id == user_id
    ).first()
    
    if not notification:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="通知不存在"
        )
    
    # 标记为已读
    if not notification.read:
        notification.read = True
        db.commit()
        db.refresh(notification)
    
    return notification

# 标记通知为已读
@router.post("/me/notifications/read")
async def mark_notifications_read(
    user_id: int,
    data: NotificationRead,
    db: Session = Depends(database.get_db)
):
    # 查找用户
    db_user = db.query(User).filter(User.id == user_id).first()
    if not db_user:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="用户不存在"
        )
    
    # 标记通知为已读
    notifications = db.query(Notification).filter(
        Notification.id.in_(data.notification_ids),
        Notification.user_id == user_id
    ).all()
    
    for notification in notifications:
        notification.read = True
    
    db.commit()
    
    return {"success": True, "message": "通知已标记为已读"}

# 提交提现申请
@router.post("/me/withdrawals", response_model=WithdrawalResponse)
async def create_withdrawal(
    user_id: int,
    withdrawal_data: WithdrawalRequest,
    db: Session = Depends(database.get_db)
):
    # 查找用户
    db_user = db.query(User).filter(User.id == user_id).first()
    if not db_user:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="用户不存在"
        )
    
    # 验证提现金额
    if withdrawal_data.amount <= 0:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="提现金额必须大于0"
        )
    
    if withdrawal_data.amount > db_user.balance:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="余额不足"
        )
    
    # 创建提现记录
    withdrawal = Withdrawal(
        user_id=user_id,
        amount=withdrawal_data.amount,
        bank_account=withdrawal_data.bank_account,
        bank_name=withdrawal_data.bank_name,
        created_at=datetime.utcnow()
    )
    
    # 更新用户余额（实际应用中可能需要在提现审核通过后才更新）
    # db_user.balance -= withdrawal_data.amount
    
    db.add(withdrawal)
    db.commit()
    db.refresh(withdrawal)
    
    # 创建提现通知
    notification = Notification(
        user_id=user_id,
        title="提现申请已提交",
        content=f"您的{withdrawal_data.amount}元提现申请已提交，请等待审核。",
        type="transaction"
    )
    
    db.add(notification)
    db.commit()
    
    return withdrawal

# 获取提现记录
@router.get("/me/withdrawals", response_model=List[WithdrawalResponse])
async def get_withdrawals(
    user_id: int,
    status: Optional[str] = None,
    limit: int = 20,
    offset: int = 0,
    db: Session = Depends(database.get_db)
):
    # 查找用户
    db_user = db.query(User).filter(User.id == user_id).first()
    if not db_user:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="用户不存在"
        )
    
    # 构建查询
    query = db.query(Withdrawal).filter(Withdrawal.user_id == user_id)
    
    # 过滤状态
    if status is not None:
        query = query.filter(Withdrawal.status == status)
    
    # 分页和排序
    withdrawals = query.order_by(Withdrawal.created_at.desc()).offset(offset).limit(limit).all()
    
    return withdrawals