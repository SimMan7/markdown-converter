from app import db
from datetime import datetime
from sqlalchemy import func


class FileUpload(db.Model):
    """Track file uploads and conversions"""
    __tablename__ = 'file_uploads'
    
    id = db.Column(db.Integer, primary_key=True)
    filename = db.Column(db.String(255), nullable=False)
    original_filename = db.Column(db.String(255), nullable=False)
    file_size = db.Column(db.Integer, nullable=False)  # Size in bytes
    upload_time = db.Column(db.DateTime, default=datetime.utcnow, nullable=False)
    ip_address = db.Column(db.String(45))  # IPv6 compatible
    user_agent = db.Column(db.Text)
    
    # Conversion tracking
    pdf_downloaded = db.Column(db.Boolean, default=False)
    docx_downloaded = db.Column(db.Boolean, default=False)
    pdf_download_time = db.Column(db.DateTime)
    docx_download_time = db.Column(db.DateTime)
    
    def __repr__(self):
        return f'<FileUpload {self.original_filename}>'
    
    @classmethod
    def get_recent_uploads(cls, limit=10):
        """Get recent file uploads"""
        return cls.query.order_by(cls.upload_time.desc()).limit(limit).all()
    
    @classmethod
    def get_upload_stats(cls):
        """Get upload statistics"""
        total_uploads = cls.query.count()
        pdf_downloads = cls.query.filter(cls.pdf_downloaded == True).count()
        docx_downloads = cls.query.filter(cls.docx_downloaded == True).count()
        
        # Get uploads from last 24 hours
        from datetime import timedelta
        yesterday = datetime.utcnow() - timedelta(days=1)
        recent_uploads = cls.query.filter(cls.upload_time >= yesterday).count()
        
        return {
            'total_uploads': total_uploads,
            'pdf_downloads': pdf_downloads,
            'docx_downloads': docx_downloads,
            'recent_uploads': recent_uploads
        }


class ConversionAnalytics(db.Model):
    """Track conversion analytics and performance"""
    __tablename__ = 'conversion_analytics'
    
    id = db.Column(db.Integer, primary_key=True)
    file_upload_id = db.Column(db.Integer, db.ForeignKey('file_uploads.id'), nullable=False)
    conversion_type = db.Column(db.String(10), nullable=False)  # 'pdf' or 'docx'
    conversion_time = db.Column(db.DateTime, default=datetime.utcnow, nullable=False)
    processing_duration = db.Column(db.Float)  # Time in seconds
    success = db.Column(db.Boolean, default=True)
    error_message = db.Column(db.Text)
    
    # Relationship
    file_upload = db.relationship('FileUpload', backref=db.backref('conversions', lazy=True))
    
    def __repr__(self):
        return f'<Conversion {self.conversion_type} for {self.file_upload_id}>'
    
    @classmethod
    def get_conversion_stats(cls):
        """Get conversion statistics"""
        total_conversions = cls.query.count()
        successful_conversions = cls.query.filter(cls.success == True).count()
        failed_conversions = cls.query.filter(cls.success == False).count()
        
        # Average processing time
        avg_processing_time = db.session.query(func.avg(cls.processing_duration)).filter(
            cls.success == True
        ).scalar() or 0
        
        # Conversion type breakdown
        pdf_conversions = cls.query.filter(cls.conversion_type == 'pdf').count()
        docx_conversions = cls.query.filter(cls.conversion_type == 'docx').count()
        
        return {
            'total_conversions': total_conversions,
            'successful_conversions': successful_conversions,
            'failed_conversions': failed_conversions,
            'avg_processing_time': round(avg_processing_time, 2) if avg_processing_time else 0,
            'pdf_conversions': pdf_conversions,
            'docx_conversions': docx_conversions,
            'success_rate': round((successful_conversions / total_conversions * 100), 1) if total_conversions > 0 else 0
        }


class SiteVisit(db.Model):
    """Track site visits for analytics"""
    __tablename__ = 'site_visits'
    
    id = db.Column(db.Integer, primary_key=True)
    visit_time = db.Column(db.DateTime, default=datetime.utcnow, nullable=False)
    ip_address = db.Column(db.String(45))
    user_agent = db.Column(db.Text)
    referrer = db.Column(db.String(255))
    page_visited = db.Column(db.String(100), default='/')
    
    def __repr__(self):
        return f'<Visit {self.visit_time}>'
    
    @classmethod
    def get_visit_stats(cls):
        """Get site visit statistics"""
        from datetime import timedelta
        
        total_visits = cls.query.count()
        
        # Visits from last 24 hours
        yesterday = datetime.utcnow() - timedelta(days=1)
        recent_visits = cls.query.filter(cls.visit_time >= yesterday).count()
        
        # Unique visitors (based on IP)
        unique_visitors = db.session.query(cls.ip_address).distinct().count()
        
        return {
            'total_visits': total_visits,
            'recent_visits': recent_visits,
            'unique_visitors': unique_visitors
        }