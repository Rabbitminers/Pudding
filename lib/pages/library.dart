import 'dart:io';

import 'package:epubx/epubx.dart';
import 'package:file_picker/file_picker.dart';
import 'package:flutter/material.dart';
import 'package:flutter/widgets.dart';
import 'package:pudding/pages/reader.dart';

class LibraryPage extends StatefulWidget {
  const LibraryPage({super.key});

  @override
  State<LibraryPage> createState() => _LibraryPageState();
}

class _LibraryPageState extends State<LibraryPage> {
  List<EpubBook> books = List.empty();

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      body: Center(
        child: ElevatedButton(
            onPressed: readBook, child: const Text("Choose book")),
      ),
    );
  }

  Future<void> readBook() async {
    final FilePickerResult? result = await FilePicker.platform.pickFiles(
        dialogTitle: 'Pick a book to add to your library',
        type: FileType.custom,
        allowedExtensions: ['epub'],
        allowMultiple: false);

    if (result == null) {
      return null;
    }

    var file = File(result.files.single.path!);
    var contents = await file.readAsBytes();

    var book = await EpubReader.readBook(contents);

    Navigator.push(
        context, MaterialPageRoute(builder: (context) => Reader(book: book)));
  }
}
