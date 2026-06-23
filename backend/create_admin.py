import sys
import os

# Add backend directory to Python path
sys.path.append(os.path.dirname(os.path.abspath(__file__)))

from sqlalchemy.orm import Session
from app.core.database import SessionLocal, engine, Base
from app.models.user import User
from app.core.security import hash_password

def init_db():
    Base.metadata.create_all(bind=engine)
    db: Session = SessionLocal()
    
    admin_email = "admin@admin.com"
    admin_user = db.query(User).filter(User.email == admin_email).first()
    
    if not admin_user:
        print(f"Creating admin user: {admin_email}")
        admin = User(
            email=admin_email,
            password_hash=hash_password("admin"),
            nama="Administrator",
            role="dokter"
        )
        db.add(admin)
        db.commit()
        db.refresh(admin)
        print("Admin user created successfully!")
    else:
        print(f"Admin user {admin_email} already exists.")
        # Update password just in case it was created with passlib before
        admin_user.password_hash = hash_password("admin")
        db.commit()
        print("Admin user password updated to 'admin'")

    db.close()

if __name__ == "__main__":
    init_db()
