<?php
	$items = [
		[
			'title' => 'Water',
			'price' => 10,
			'image' => '../sources/water.jpg'
		],
		[
			'title' => 'Coffee',
			'price' => 70,
			'image' => '../sources/coffee.jpg'
		],
		[
			'title' => 'Mango juice',
			'price' => 30,
			'image' => '../sources/mango-juice.jpg'
		],
	];

	header('Content-type: application/json');
	echo json_encode($items);