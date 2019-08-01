document.body.innerHTML = `
	<h1 class="heading">This is a test</h1>
	<div id="test-1" class="cont">
		<h2 class="heading">Test 1</h2>
		<p>Lorem ipsum dolor sit amet, consectetur adipisicing elit, sed do eiusmod
		tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam,
		quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo
		consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse
		cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non
		proident, sunt in culpa qui officia deserunt mollit anim id est laborum.</p>
	</div>
	<div id="test-2" class="active cont">
		<h2 class="heading"><span class="bold">Test 2</span></h2>
		<p>Lorem ipsum dolor sit amet, consectetur adipisicing elit, sed do eiusmod
		tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam,
		quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo
		consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse
		cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non
		proident, sunt in culpa qui officia deserunt mollit anim id est laborum.</p>
	</div>
	<div>
		<p class="empty"></p>
	</div>
	<form>
		<input type="text" name="input-1" value="test case 1">
		<input type="number" name="input-2" value="1">
		<select>
			<option>test case 2</option>
		</select>
	</form>
`;
