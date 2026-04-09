"""Phase 4 baseline migration placeholder.

This repo includes a lightweight migration stub to show the intended PostgreSQL + Alembic setup.
Generate and refine migrations in a real environment with:
    alembic revision --autogenerate -m "baseline"
    alembic upgrade head
"""

revision = '0001_phase4_baseline'
down_revision = None
branch_labels = None
depends_on = None


def upgrade() -> None:
    pass


def downgrade() -> None:
    pass
