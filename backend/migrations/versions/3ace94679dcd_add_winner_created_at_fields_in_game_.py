"""add winner\created at fields in game table

Revision ID: 3ace94679dcd
Revises: a156cae51fb4
Create Date: 2024-11-13 14:13:55.366874

"""
from typing import Sequence, Union

from alembic import op
import sqlalchemy as sa


# revision identifiers, used by Alembic.
revision: str = '3ace94679dcd'
down_revision: Union[str, None] = 'a156cae51fb4'
branch_labels: Union[str, Sequence[str], None] = None
depends_on: Union[str, Sequence[str], None] = None


def upgrade() -> None:
    # ### commands auto generated by Alembic - please adjust! ###
    op.add_column('game', sa.Column('created_at', sa.TIMESTAMP(), nullable=True))
    op.alter_column('game', 'player_1_id',
               existing_type=sa.INTEGER(),
               nullable=True)
    # ### end Alembic commands ###


def downgrade() -> None:
    # ### commands auto generated by Alembic - please adjust! ###
    op.alter_column('game', 'player_1_id',
               existing_type=sa.INTEGER(),
               nullable=False)
    op.drop_column('game', 'created_at')
    # ### end Alembic commands ###
