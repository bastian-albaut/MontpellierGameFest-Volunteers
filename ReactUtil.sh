#!/bin/bash

command=$1
arg=$2
sass=$3
name=$4

create_folder_file () {
	mkdir -p src/$arg\s/$name
	touch src/$arg\s/$name/$name.jsx
}

create_with_sass () {
	create_folder_file
	(
	echo "import \"../../styles/${arg}s/$(tr [A-Z] [a-z] <<< "$name").scss\" "
	echo ""
	echo "const $name = () => {"
	echo -e "\treturn("
	echo ""
	echo -e "\t)"
	echo "}"
	echo ""
	echo "export default $name"
	) > src/$arg\s/$name/$name.jsx

	mkdir -p src/styles/$arg\s
	touch src/styles/$arg\s/"$(tr [A-Z] [a-z] <<< "$name")".scss
}

create_without_sass () {
	create_folder_file
	(
	echo ""
	echo "const $name = () => {"
	echo -e "\treturn("
	echo ""
	echo -e "\t)"
	echo "}"
	echo ""
	echo "export default $name"
	) > src/$arg\s/$name/$name.jsx
}

if [ $command == "create" ]
then

	if [ $arg == "component" ]
	then
		
		if [ $sass == 1 ]
		then
  			create_with_sass
  			echo "You successfully created component ${name} with sass"
		elif [ $sass == 0 ]
		then
  			create_without_sass
  			echo "You successfully created component ${name} without sass"
		else
  			echo "wrong third arg"
  			exit 1
		fi

	elif [ $arg == "page" ] 
	then

		if [ $sass == 1 ]
                then
                        create_with_sass
                        echo "You successfully created page ${name} with sass"
		elif [ $sass == 0 ]
                then
                        create_without_sass
                        echo "You successfully created page ${name} without sass"
                else
                        echo "wrong third arg"
                        exit 1
                fi


	else
 		echo "invalid second arg"
 		exit 1
	fi
elif [ $command == "help" ]
then
	echo "./ReactUtil.sh create <component|page> <sass?> <name>"
	echo "./ReactUtil.sh help"

else
	echo "invalid command"
	exit 1
fi

exit 0
