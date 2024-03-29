"""empty message

Revision ID: 61b61c3fe1a1
Revises: 4a29b8c2a519
Create Date: 2022-07-17 15:25:22.193798

"""
from alembic import op
import sqlalchemy as sa


# revision identifiers, used by Alembic.
revision = '61b61c3fe1a1'
down_revision = '4a29b8c2a519'
branch_labels = None
depends_on = None


def upgrade():
    # ### commands auto generated by Alembic - please adjust! ###
    op.add_column('room', sa.Column('owner', sa.String(length=20), nullable=False))
    op.create_unique_constraint(None, 'room', ['owner'])
    # ### end Alembic commands ###


def downgrade():
    # ### commands auto generated by Alembic - please adjust! ###
    op.drop_constraint(None, 'room', type_='unique')
    op.drop_column('room', 'owner')
    # ### end Alembic commands ###
