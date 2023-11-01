import { PrismaClient } from '@prisma/client';


const prisma = new PrismaClient();

async function main() {

	
	let joao = await prisma.user.create({
		data: {
		  login: "jopop",
		  email: "joao@42sp.com.br",
		  first_name: "João",
		  last_name: "Silva",
		  nickname: "Silvão",
		  points: 7,
		},
	  });
	
	let jose = await prisma.user.create({
		data: {
		  login: "josew",
		  email: "jose@42sp.com.br",
		  first_name: "Jose",
		  last_name: "Pereira",
		  nickname: "Firmeza",
		  points: 0,
		  friends: {
			connect: [
				{id: joao.id},
			],
		  },
		},
	});

	let julia = await prisma.user.create({
		data: {
		  login: "juliaL",
		  email: "julia@42sp.com.br",
		  first_name: "Jullia",
		  last_name: "Lacrux",
		  nickname: "Mia",
		  points: 2,
		  friends: {
			connect: [
				{id: jose.id,}, {id: joao.id},
			],
		  },
		},
	  });

	
	let game1 = await prisma.match.create ({
		data: {
			player_1 : {
				connect : {
					id: julia.id,
				}
			},
			score_p1: 5,
			player_2 : {
				connect : {
					id: jose.id,
				}
			},
			score_p2: 2,

			winner : {
				connect : {
					id: julia.id,
				},
			},

			loser : {
				connect : {
					id: jose.id,
				},
			},

			draws: false,

		},
	});

	let game2 = await prisma.match.create ({
		data: {
			player_1 : {
				connect : {
					id: joao.id,
				}
			},
			score_p1: 6,
			player_2 : {
				connect : {
					id: jose.id,
				}
			},
			score_p2: 5,

			winner : {
				connect : {
					id: joao.id,
				},
			},

			loser : {
				connect : {
					id: jose.id,
				},
			},

			draws: false,

		},
	});

	let game3 = await prisma.match.create ({
		data: {
			player_1 : {
				connect : {
					id: julia.id,
				}
			},
			score_p1: 3,
			player_2 : {
				connect : {
					id: jose.id,
				}
			},
			score_p2: 15,

			winner : {
				connect : {
					id: jose.id,
				},
			},

			loser : {
				connect : {
					id: julia.id,
				},
			},

			draws: false,

		},
	});

	let game4 = await prisma.match.create ({
		data: {
			player_1 : {
				connect : {
					id: julia.id,
				}
			},
			score_p1: 3,
			player_2 : {
				connect : {
					id: joao.id,
				}
			},
			score_p2: 15,

			winner : {
				connect : {
					id: joao.id,
				},
			},

			loser : {
				connect : {
					id: julia.id,
				},
			},

			draws: false,

		},
	});

	let game5 = await prisma.match.create ({
		data: {
			player_1 : {
				connect : {
					id: julia.id,
				}
			},
			score_p1: 15,
			player_2 : {
				connect : {
					id: jose.id,
				}
			},
			score_p2: 15,

			draws: true,

		},
	});

	let game6 = await prisma.match.create ({
		data: {
			player_1 : {
				connect : {
					id: joao.id,
				}
			},
			score_p1: 3,
			player_2 : {
				connect : {
					id: jose.id,
				}
			},
			score_p2: 3,

			draws: true,

		},
	});
}



main()
  .then(async () => {
    await prisma.$disconnect()
  })
  .catch(async (e) => {
    console.error(e)
    await prisma.$disconnect()
    process.exit(1)
  })