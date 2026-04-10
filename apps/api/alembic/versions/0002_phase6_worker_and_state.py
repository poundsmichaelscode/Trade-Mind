"""phase6 worker and state placeholders

Revision ID: 0002_phase6
Revises: 0001_phase4_baseline
"""
from alembic import op
import sqlalchemy as sa

revision = '0002_phase6'
down_revision = '0001_phase4_baseline'
branch_labels = None
depends_on = None

def upgrade():
    op.add_column('users', sa.Column('avatar_url', sa.String(length=500), nullable=True))

def downgrade():
    op.drop_column('users', 'avatar_url')
