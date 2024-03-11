import 'dart:io';

import 'package:epubx/epubx.dart';
import 'package:file_picker/file_picker.dart';
import 'package:flutter/material.dart';
import 'package:fluttertoast/fluttertoast.dart';
import 'package:pudding/constants.dart';
import 'package:pudding/pages/library.dart';

void main() => runApp(const PuddingApp());

class PuddingApp extends StatelessWidget {
  const PuddingApp({super.key});

  @override
  Widget build(BuildContext context) {
    return MaterialApp(
        title: Constants.appName,
        theme: ThemeData(
          colorScheme: ColorScheme.fromSeed(seedColor: Colors.yellow),
          useMaterial3: true,
        ),
        home: const LibraryPage());
  }
}

Future<void> readEpubFile() async {
  final FilePickerResult? result = await FilePicker.platform.pickFiles(
      dialogTitle: 'Pick a book to add to your library',
      type: FileType.custom,
      allowedExtensions: ['epub'],
      allowMultiple: false);

  if (result != null) {
    var file = File(result.files.single.path!);

    var contents = await file.readAsBytes();
    var book = await EpubReader.readBook(contents);

    print(book.Title);

    Fluttertoast.showToast(
      msg: "This is Center Short Toast",
      toastLength: Toast.LENGTH_LONG,
      gravity: ToastGravity.BOTTOM,
      timeInSecForIosWeb: 6,
      backgroundColor: Colors.amber,
      textColor: Colors.white,
      fontSize: 16.0,
    );
  } else {
    print("File not fount");
  }
}
