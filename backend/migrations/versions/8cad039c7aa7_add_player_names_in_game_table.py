"""add player names in game table

Revision ID: 8cad039c7aa7
Revises: 3ace94679dcd
Create Date: 2024-11-14 15:59:46.121321

"""
from typing import Sequence, Union

from alembic import op
import sqlalchemy as sa


# revision identifiers, used by Alembic.
revision: str = '8cad039c7aa7'
down_revision: Union[str, None] = '3ace94679dcd'
branch_labels: Union[str, Sequence[str], None] = None
depends_on: Union[str, Sequence[str], None] = None


def upgrade() -> None:
    # ### commands auto generated by Alembic - please adjust! ###
    op.add_column('game', sa.Column('player_1_name', sa.String(), nullable=True))
    op.add_column('game', sa.Column('player_2_name', sa.String(), nullable=True))
    # ### end Alembic commands ###


def downgrade() -> None:
    # ### commands auto generated by Alembic - please adjust! ###
    op.drop_column('game', 'player_2_name')
    op.drop_column('game', 'player_1_name')
    # ### end Alembic commands ###